import type { ToolConfig } from '@editorjs/editorjs';
import type {
  BlockTool,
  BlockToolConstructor,
  BlockToolConstructorOptions,
  BlockToolData,
  BlockToolOptions,
  TextNodeSerialized
} from '@editorjs/sdk';
import {
  KeyAddedEvent,
  KeyRemovedEvent,
  ToolType,
  ValueNodeChangedEvent
} from '@editorjs/sdk';
import type { DOMBlockToolAdapter } from '@editorjs/dom-adapters';
import { IconH1, IconH2, IconH3, IconH4, IconH5, IconH6 } from '@codexteam/icons';
import styles from './index.module.pcss';

/**
 * Heading levels supported by the Header tool
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Data structure describing the tool's input/output data
 */
export type HeaderData = BlockToolData<{
  /**
   * Text content of the heading
   */
  text: TextNodeSerialized;

  /**
   * Heading level (1–6)
   */
  level: HeadingLevel;
}>;

/**
 * User-end configuration for the tool
 */
export type HeaderConfig = ToolConfig<{
  /**
   * Placeholder for an empty heading
   */
  placeholder?: string;

  /**
   * Fallback heading level used when the persisted or provided level is missing or invalid
   */
  defaultLevel?: HeadingLevel;

  /**
   * Heading levels available to the user
   */
  levels?: HeadingLevel[];
}>;

/**
 * All heading levels the tool structurally supports
 */
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- self-evident from the comment above
const ALL_LEVELS: readonly HeadingLevel[] = [1, 2, 3, 4, 5, 6];
const LEVEL_ICONS = [IconH1, IconH2, IconH3, IconH4, IconH5, IconH6];

/**
 * Resolves which levels are allowed for a given config, falling back to all levels when
 * `levels` is missing or has no valid entries. Kept as a standalone function since both
 * the constructor and the static {@link Header.options} factory need it.
 * @param levels - candidate levels from {@link HeaderConfig.levels}
 */
function resolveLevels(levels: HeadingLevel[] | undefined): readonly HeadingLevel[] {
  if (levels === undefined) {
    return ALL_LEVELS;
  }

  const valid = levels.filter(level => ALL_LEVELS.includes(level));

  return valid.length > 0 ? valid : ALL_LEVELS;
}

/**
 * Header block tool
 */
export class Header implements BlockTool<HeaderData, HeaderConfig> {
  /**
   * Tool type — Header is a Block Tool
   */
  public static type = ToolType.Block as const;

  /**
   * Tool name used to register and identify it within the editor
   */
  public static name = 'header';

  /**
   * Heading level used when neither persisted data, config's defaultLevel, nor config's
   * levels resolve to a valid choice
   */
  static readonly #defaultLevel: HeadingLevel = 2;

  /**
   * Adapter for linking block data with the DOM
   */
  #adapter: DOMBlockToolAdapter;

  /**
   * User-end configuration passed to the tool
   */
  #config: HeaderConfig;

  /**
   * Levels allowed by {@link HeaderConfig.levels}, resolved once at construction
   */
  #levels: readonly HeadingLevel[];

  /**
   * Currently applied heading level
   */
  #currentLevel: HeadingLevel;

  /**
   * Tool's wrapper element, created lazily on first {@link render} call
   */
  #wrapper: HTMLDivElement | undefined;

  /**
   * Heading input element, created lazily once the model registers the "text" key
   */
  #headingEl: HTMLElement | undefined;

  /**
   * @param options - Block tool constructor options
   */
  constructor({
    adapter,
    data,
    config,
  }: BlockToolConstructorOptions<
    HeaderData,
    HeaderConfig,
    DOMBlockToolAdapter
  >) {
    this.#adapter = adapter;
    this.#config = config ?? ({} as HeaderConfig);
    this.#levels = resolveLevels(this.#config.levels);

    const level = this.#normalizeLevel(data?.level);

    this.#currentLevel = level;

    /**
     * addEventListener must be called before registerTextInputKey/registerValueKey —
     * those synchronously fire a DataNodeAddedEvent, which the adapter turns into a
     * KeyAddedEvent. If the listener isn't attached yet, that event is lost.
     */
    adapter.addEventListener('adapter:updated', this.#onUpdate);
    adapter.registerTextInputKey('text', data?.text);
    adapter.registerValueKey<HeadingLevel>('level', level);
  }

  /**
   * Static tool options: toolbox entries, conversion config, and split behavior
   *
   * A factory rather than a plain object, so the toolbox can offer exactly the levels
   * {@link HeaderConfig.levels} allows instead of a fixed set decided before any config
   * exists.
   * @param config - config supplied to `use(Header, { config })`, or `{}` if omitted
   */
  public static readonly options = (config: HeaderConfig): BlockToolOptions<HeaderConfig, HeaderData> => ({
    /**
     * One toolbox entry per level allowed by config.levels (all six when omitted)
     */
    toolbox: resolveLevels(config.levels).map(level => ({
      title: `Heading ${level}`,
      icon: LEVEL_ICONS[level - 1],
      data: { level },
    })),

    /**
     * Maps the block's text content to/from the shared "text" conversion key
     */
    conversionConfig: {
      import: 'text',
      export: 'text',
    },

    /**
     * Header blocks can't be split into two header blocks
     */
    canBeSplit: false as const,
  });

  /**
   * Returns tool's wrapper, creating it if it doesn't exist yet.
   * As we maintain the data-first approach, actual inputs should be rendered only when the model is updated.
   */
  public render(): HTMLElement {
    if (this.#wrapper === undefined) {
      this.#wrapper = document.createElement('div');
    }

    return this.#wrapper;
  }

  /**
   * Normalizes a raw value to a valid HeadingLevel allowed by {@link HeaderConfig.levels},
   * falling back to {@link HeaderConfig.defaultLevel} or the tool default.
   * @param raw - Candidate level to validate; not guaranteed to be a number, an integer, or an allowed level
   */
  #normalizeLevel(raw: unknown): HeadingLevel {
    if (
      typeof raw === 'number'
      && Number.isInteger(raw)
      && this.#levels.includes(raw as HeadingLevel)
    ) {
      return raw as HeadingLevel;
    }
    const fallback = this.#config.defaultLevel;

    if (
      fallback !== undefined
      && Number.isInteger(fallback)
      && this.#levels.includes(fallback)
    ) {
      return fallback;
    }

    return this.#levels.includes(Header.#defaultLevel) ? Header.#defaultLevel : this.#levels[0];
  }

  /**
   * Creates a heading element for the given level
   * @param level - heading level to create an element for
   */
  #createHeadingEl(level: HeadingLevel): HTMLElement {
    const el = document.createElement(`h${level}`);

    el.classList.add(styles.header);
    el.contentEditable = 'true';

    return el;
  }

  /**
   * Replaces the current heading element with one of a new level, preserving the DOM position
   * @param level - heading level to swap to
   */
  #swapHeadingTag(level: HeadingLevel): void {
    if (this.#headingEl === undefined) {
      return;
    }
    const newEl = this.#createHeadingEl(level);

    this.#headingEl.replaceWith(newEl);
    this.#headingEl = newEl;
    this.#adapter.setInput('text', newEl);
  }

  /**
   * Callback for Adapter updates
   * @param event - adapter event (KeyAdded, KeyRemoved or ValueChanged)
   */
  #onUpdate = (event: Event): void => {
    switch (true) {
      case event instanceof KeyAddedEvent: {
        if (event.detail.key !== 'text') {
          break;
        }
        const el = this.#createHeadingEl(this.#currentLevel);

        this.#headingEl = el;
        this.#wrapper?.append(el);
        this.#adapter.setInput('text', el);

        break;
      }

      case event instanceof KeyRemovedEvent: {
        if (event.detail.key !== 'text') {
          break;
        }
        this.#adapter.setInput('text', undefined);
        this.#headingEl?.remove();
        this.#headingEl = undefined;

        break;
      }

      case event instanceof ValueNodeChangedEvent: {
        if (event.detail.key !== 'level') {
          break;
        }
        const newLevel = this.#normalizeLevel(event.detail.value);

        if (newLevel === this.#currentLevel) {
          break;
        }
        this.#currentLevel = newLevel;
        this.#swapHeadingTag(newLevel);

        break;
      }
    }
  };
}

Header satisfies BlockToolConstructor<
  HeaderData,
  HeaderConfig,
  DOMBlockToolAdapter
>;
