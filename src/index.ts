// Import necessary styles
import './index.css';

// Import icons
import { IconH1, IconH2, IconH3, IconH4, IconH5, IconH6, IconHeading } from '@codexteam/icons';

/**
 * EditorJS's API
 */
export interface API {
    i18n: {
      t: (key: string) => string;
    };
    styles: {
      block: string;
    };
  }

/**
 * Tool's input and output data format
 */
export interface HeaderData {
 /**
  * Header's content
  */    
  text: string;

 /**
  * Header's level from 1 to 6
  */  
  level: number;
}

/**
 * Tool's config from Editor
 */
export interface HeaderConfig {
 /**
  * Block's placeholder
  */  
  placeholder?: string;

 /**
  * Heading levels
  */  
  levels?: number[];

 /**
  * Default level
  */ 
  defaultLevel?: number;
}

/**
 * Header's level from 1 to 6
 */
interface Level {
 /**
  * Level's number
  */ 
  number: number;

 /**
  * Tag corresponds to the level number
  */ 
  tag: string;
 
 /**
  * Icon
  */
  svg: string;
}

/**
 * Extend the standard HTMLHeadingElement type to include the align property
 */
interface HTMLHeadingElementWithAlign extends HTMLHeadingElement {
    align: string;
  }

/**
 * Event with pasted content
 */
interface PasteEvent {
    detail: { data: HTMLElement }
}  
  

/**
 * Header block for the Editor.js.
 */
export default class Header {
  api: API;   
  readOnly: boolean;
  _CSS: {
    block: string;
    wrapper: string;
  };
  _settings: HeaderConfig;
  _data: HeaderData;
  _element: HTMLHeadingElementWithAlign ;

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: HeaderData, config: HeaderConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read only mode flag
   */
  constructor({ data, config, api, readOnly }: { data: HeaderData; config: HeaderConfig; api: API; readOnly: boolean }) {
    this.api = api;
    this.readOnly = readOnly;

    /**
     * Styles
     *
     * @type {object}
     */
    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-header',
    };

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
     * @type {HTMLHeadingElementWithAlign}
     * @private
     */
    this._element = this.getTag();
  }

  /**
   * Normalize input data
   *
   * @param {HeaderData} data - saved data to process
   *
   * @returns {HeaderData}
   * @private
   */
  normalizeData(data: HeaderData): HeaderData {
    const newData: HeaderData = {
      text: data.text || '',
      level: parseInt(data.level as any) || this.defaultLevel.number,
    };

    return newData;
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLHeadingElementWithAlign}
   * @public
   */
  render(): HTMLHeadingElementWithAlign {
    return this._element;
  }

  /**
   * Returns header block tunes config
   *
   * @returns {Array}
   */
  renderSettings(): Array<{ icon: string; label: string; onActivate: () => void; closeOnActivate: boolean; isActive: boolean }> {
    return this.levels.map((level) => ({
      icon: level.svg,
      label: this.api.i18n.t(`Heading ${level.number}`),
      onActivate: () => this.setLevel(level.number),
      closeOnActivate: true,
      isActive: this.currentLevel.number === level.number,
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
    const newData: HeaderData = {
      text: this.data.text + data.text,
      level: this.data.level,
    };

    this.data = newData;
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
  static get conversionConfig(): { export: string; import: string } {
    return {
      export: 'text',
      import: 'text',
    };
  }

  /**
   * Sanitizer Rules
   */
  static get sanitize(): { level: boolean; text: {} } {
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
  static get isReadOnlySupported(): boolean {
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
       * @type {HTMLHeadingElementWithAlign}
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
       * @type {HTMLHeadingElementWithAlign}
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
   * @returns {HTMLHeadingElementWithAlign}
   */
  getTag(): HTMLHeadingElementWithAlign {
    /**
     * Create element for current Block's level
     */
     const tag = document.createElement(this.currentLevel.tag) as HTMLHeadingElementWithAlign;

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
    let level = this.levels.find((levelItem) => levelItem.number === this._data.level);

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
      const userSpecified = this.levels.find((levelItem) => {
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
  
    const settingsLevels = this._settings?.levels;
  
    if (Array.isArray(settingsLevels)) {
      return availableLevels.filter(l => settingsLevels.includes(l.number));
    }
  
    return availableLevels;
  }
  
  /**
   * Handle H1-H6 tags on paste to substitute it with header Tool
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(event: PasteEvent): void {
    const content = event.detail.data;

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

/**
 * Used by Editor.js paste handling API.
 * Provides configuration to handle H1-H6 tags.
 *
 * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
 */
static get pasteConfig() {
    return {
      handler: (content: HTMLElement) => {
        return { text: content.innerHTML };
      },
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
  static get toolbox(): { icon: string; title: string } {
    return {
      icon: IconHeading,
      title: 'Heading',
    };
  }
}
