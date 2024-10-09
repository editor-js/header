/**
 * Build styles
 */
import './index.css';

import { IconH1, IconH2, IconH3, IconH4, IconH5, IconH6, IconHeading } from '@codexteam/icons';
import { API, BlockTune, PasteEvent } from '@editorjs/editorjs';

/**
* @description Tool's input and output data format
*/
export interface HeaderData {
  /** Header's content */
  text: string;
  /** Header's level from 1 to 6 */
  level: number;
}

/**
 * @description Tool's config from Editor
 */
export interface HeaderConfig {
  /** Block's placeholder */
  placeholder?: string;
  /** Heading levels */
  levels?: number[];
  /** Default level */
  defaultLevel?: number;
}

/**
 * @description Heading level information
 */
interface Level {
  /** Level number */
  number: number;
  /** HTML tag corresponding with level number */
  tag: string;
  /** Icon */
  svg: string;
}

/**
 * @description Constructor arguments for Header
 */
interface ConstructorArgs {
  /** Previously saved data */
  data: HeaderData | {};
  /** User config for the tool */
  config: HeaderConfig;
  /** Editor.js API */
  api: API;
  /** Read-only mode flag */
  readOnly: boolean;
}

/**
 * Header block for the Editor.js.
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license MIT
 * @version 2.0.0
 */
export default class Header {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: HeaderData, config: HeaderConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read only mode flag
   */
  /**
   * Editor.js API
  * @private
  */
  private api: API;
  /**
  * Read-only mode flag
  * @private
  */
  private readOnly: boolean;
  /**
  * Tool's settings passed from Editor
  * @private
  */
  private _settings: HeaderConfig;
  /**
  * Block's data
  * @private
  */
  private _data: HeaderData;
  /**
  * Main Block wrapper
  * @private
  */
  private _element: HTMLHeadingElement;

  constructor({ data, config, api, readOnly }: ConstructorArgs) {
    this.api = api;
    this.readOnly = readOnly;

    /**
     * Tool's settings passed from Editor
     *
     * @type {HeaderConfig}
     * @private
     */
    this._settings = config;

    /**
     * Block's data
     *
     * @type {HeaderData}
     * @private
     */
    this._data = this.normalizeData(data);

    /**
     * Main Block wrapper
     *
     * @type {HTMLElement}
     * @private
     */
    this._element = this.getTag();
  }
  /**
   * Styles
   */
  private get _CSS() {
    return {
      block: this.api.styles.block,
      wrapper: 'ce-header',
    };
  }

  /**
   * Check if data is valid
   * 
   * @param {any} data - data to check
   * @returns {data is HeaderData}
   * @private
   */
  isHeaderData(data: any): data is HeaderData {
    return (data as HeaderData).text !== undefined;
  }

  /**
   * Normalize input data
   *
   * @param {HeaderData} data - saved data to process
   *
   * @returns {HeaderData}
   * @private
   */
  normalizeData(data: HeaderData | {}): HeaderData {
    const newData: HeaderData = { text: '', level: this.defaultLevel.number };

    if (this.isHeaderData(data)) {
      newData.text = data.text || '';
  
      if (data.level !== undefined && !isNaN(parseInt(data.level.toString()))) {
        newData.level = parseInt(data.level.toString());
      }
    }

    return newData;
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLHeadingElement}
   * @public
   */
  render(): HTMLHeadingElement {
    return this._element;
  }

  /**
   * Returns header block tunes config
   *
   * @returns {Array}
   */
  renderSettings(): BlockTune[] {
    return this.levels.map(level => ({
      icon: level.svg,
      label: this.api.i18n.t(`Heading ${level.number}`),
      onActivate: () => this.setLevel(level.number),
      closeOnActivate: true,
      isActive: this.currentLevel.number === level.number,
      render: () => document.createElement('div')
    }));
  }

  /**
   * Callback for Block's settings buttons
   *
   * @param {number} level - level to set
   */
  setLevel(level: number): void {
    this.data = {
      level: level,
      text: this.data.text,
    };
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {HeaderData} data - saved data to merger with current block
   * @public
   */
  merge(data: HeaderData): void {
    this._element.insertAdjacentHTML('beforeend', data.text)
  }

  /**
   * Validate Text block data:
   * - check for emptiness
   *
   * @param {HeaderData} blockData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(blockData: HeaderData): boolean {
    return blockData.text.trim() !== '';
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
   * @returns {HeaderData} - saved data
   * @public
   */
  save(toolsContent: HTMLHeadingElement): HeaderData {
    return {
      text: toolsContent.innerHTML,
      level: this.currentLevel.number,
    };
  }

  /**
   * Allow Header to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      export: 'text', // use 'text' property for other blocks
      import: 'text', // fill 'text' property from other block's export string
    };
  }

  /**
   * Sanitizer Rules
   */
  static get sanitize() {
    return {
      level: false,
      text: {},
    };
  }

  /**
   * Returns true to notify core that read-only is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get current Tools`s data
   *
   * @returns {HeaderData} Current data
   * @private
   */
  get data(): HeaderData {
    this._data.text = this._element.innerHTML;
    this._data.level = this.currentLevel.number;
    
    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {HeaderData} data — data to set
   * @private
   */
  set data(data: HeaderData) {
    this._data = this.normalizeData(data);

    /**
     * If level is set and block in DOM
     * then replace it to a new block
     */
    if (data.level !== undefined && this._element.parentNode) {
      /**
       * Create a new tag
       *
       * @type {HTMLHeadingElement}
       */
      const newHeader = this.getTag();

      /**
       * Save Block's content
       */
      newHeader.innerHTML = this._element.innerHTML;

      /**
       * Replace blocks
       */
      this._element.parentNode.replaceChild(newHeader, this._element);

      /**
       * Save new block to private variable
       *
       * @type {HTMLHeadingElement}
       * @private
       */
      this._element = newHeader;
    }

    /**
     * If data.text was passed then update block's content
     */
    if (data.text !== undefined) {
      this._element.innerHTML = this._data.text || '';
    }
  }

  /**
   * Get tag for target level
   * By default returns second-leveled header
   *
   * @returns {HTMLElement}
   */
  getTag(): HTMLHeadingElement {
    /**
     * Create element for current Block's level
     */
    const tag = document.createElement(this.currentLevel.tag) as HTMLHeadingElement;

    /**
     * Add text to block
     */
    tag.innerHTML = this._data.text || '';

    /**
     * Add styles class
     */
    tag.classList.add(this._CSS.wrapper);

    /**
     * Make tag editable
     */
    tag.contentEditable = this.readOnly ? 'false' : 'true';

    /**
     * Add Placeholder
     */
    tag.dataset.placeholder = this.api.i18n.t(this._settings.placeholder || '');

    return tag;
  }

  /**
   * Get current level
   *
   * @returns {level}
   */
  get currentLevel(): Level {
    let level = this.levels.find(levelItem => levelItem.number === this._data.level);

    if (!level) {
      level = this.defaultLevel;
    }

    return level;
  }

  /**
   * Return default level
   *
   * @returns {level}
   */
  get defaultLevel(): Level {
    /**
     * User can specify own default level value
     */
    if (this._settings.defaultLevel) {
      const userSpecified = this.levels.find(levelItem => {
        return levelItem.number === this._settings.defaultLevel;
      });

      if (userSpecified) {
        return userSpecified;
      } else {
        console.warn('(ง\'̀-\'́)ง Heading Tool: the default level specified was not found in available levels');
      }
    }

    /**
     * With no additional options, there will be H2 by default
     *
     * @type {level}
     */
    return this.levels[1];
  }

  /**
   * @typedef {object} level
   * @property {number} number - level number
   * @property {string} tag - tag corresponds with level number
   * @property {string} svg - icon
   */

  /**
   * Available header levels
   *
   * @returns {level[]}
   */
  get levels(): Level[] {
    const availableLevels = [
      {
        number: 1,
        tag: 'H1',
        svg: IconH1,
      },
      {
        number: 2,
        tag: 'H2',
        svg: IconH2,
      },
      {
        number: 3,
        tag: 'H3',
        svg: IconH3,
      },
      {
        number: 4,
        tag: 'H4',
        svg: IconH4,
      },
      {
        number: 5,
        tag: 'H5',
        svg: IconH5,
      },
      {
        number: 6,
        tag: 'H6',
        svg: IconH6,
      },
    ];

    return this._settings.levels ? availableLevels.filter(
      l => this._settings.levels!.includes(l.number)
    ) : availableLevels;
  }

  /**
   * Handle H1-H6 tags on paste to substitute it with header Tool
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(event: PasteEvent): void {
    const detail = event.detail;

    if ('data' in detail) {
      const content = detail.data as HTMLElement;
      /**
       * Define default level value
       *
       * @type {number}
       */
      let level = this.defaultLevel.number;

      switch (content.tagName) {
        case 'H1':
          level = 1;
          break;
        case 'H2':
          level = 2;
          break;
        case 'H3':
          level = 3;
          break;
        case 'H4':
          level = 4;
          break;
        case 'H5':
          level = 5;
          break;
        case 'H6':
          level = 6;
          break;
      }

      if (this._settings.levels) {
        // Fallback to nearest level when specified not available
        level = this._settings.levels.reduce((prevLevel, currLevel) => {
          return Math.abs(currLevel - level) < Math.abs(prevLevel - level) ? currLevel : prevLevel;
        });
      }

      this.data = {
        level,
        text: content.innerHTML,
      };
    }
  }

  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle H1-H6 tags.
   *
   * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
    };
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: IconHeading,
      title: 'Heading',
    };
  }
}
