import type { ToolConfig } from '@editorjs/editorjs';
import type { TextNodeSerialized } from '@editorjs/model';
import type {
  ToolType,
  BlockTool,
  BlockToolAdapter,
  BlockToolConstructor,
  BlockToolConstructorOptions,
  BlockToolData
} from '@editorjs/sdk';

/**
 * Data structure describing the tool's input/output data
 */
export type HeaderData = BlockToolData<{
  /**
   * Text content of the header
   */
  text: TextNodeSerialized;
}>;

/**
 * User-end configuration for the tool
 */
export type HeaderConfig = ToolConfig<{
  /**
   * Placeholder for an empty header
   */
  placeholder?: string;
}>;

/**
 * Heading block tool
 */
export class Header implements BlockTool<HeaderData, HeaderConfig> {
  public static type = ToolType.Block as const;

  public static name = 'header';

  /**
   * Adapter for linking block data with the DOM
   */
  #adapter: BlockToolAdapter;

  /**
   * Tool's input/output data
   */
  #data: HeaderData;

  /**
   * @param options - Block tool constructor options
   */
  constructor({ adapter, data }: BlockToolConstructorOptions<HeaderData, HeaderConfig>) {
    this.#adapter = adapter;
    this.#data = data;
  }

  /**
   * Creates tool element
   */
  public render(): HTMLElement {
    const wrapper = document.createElement('h2');

    wrapper.classList.add('editorjs-header');

    wrapper.contentEditable = 'true';
    wrapper.style.outline = 'none';
    wrapper.style.whiteSpace = 'pre-wrap';

    this.#adapter.attachInput('text', wrapper);

    return wrapper;
  }
}

Header satisfies BlockToolConstructor<HeaderData>;