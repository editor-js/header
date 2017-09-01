'use strict';

/**
 * Header Plugin
 */

module.exports = function () {
  /**
   * Load module package info
   */
  let {exportModuleName, version} = require('../package');

  /**
   * Create variable for tag element
   */
  let element;

  let render_ = require('./js/render');

  /**
   * Wrapper for render function
   *
   * @param {object} data      — plugin json data to be converted HTML element
   * @return {object} element  — DOM element
   */
  let render = function render(data) {
    element = render_(data);
    return element;
  };

  /**
   * Wrapper for validate function
   */
  let validate = function validate() {
    let validate_ = require('./js/validate');

    return validate_;
  };

  /**
   * Wrapper for save function
   *
   * @return {object} element — block
   */
  let save = function save() {
    let save_ = require('./js/save'),
        jsonData = save_(element);

    return jsonData;
  };

  /**
   * Create and return settings panel
   *
   *            [@] [X]
   * +-----------^--+
   * | H1 | H2 | H3 |
   * +--------------+
   *
   * @return settingsPopup — settings block
   */
  let makeSettings = function makeSettings() {
    let classPopup = 'cdx-plugin-settings--horisontal',
        classPopupItem = 'cdx-plugin-settings__item';

    let settings = document.createElement('DIV');

    settings.classList.add(classPopup);

    /**
     * Define settings items
     */
    let types = {
      h2: 'H2',
      h3: 'H3',
      h4: 'H4'
    };

    /**
     * Replaces old header with new type
     * @param {string} type - new header tagName: H1—H6
     */
    let selectTypeClicked = function selectTypeClicked(type) {
      let newElement = {};

      /**
       * Render new element
       */
      newElement['heading-styles'] = type;
      newElement['text'] = element.textContent;
      newElement = render_(newElement);

      /**
       * Migrate tool option
       */
      newElement.tool = element.tool;

      /**
       * Replace element variable
       */
      element.parentNode.replaceChild(newElement, element);
      element = newElement;
    };

    /**
     * Append settings items
     */
    for (let type in types) {
      let selectTypeButton = document.createElement('SPAN');

      selectTypeButton.classList.add(classPopupItem);
      selectTypeButton.textContent = types[type];

      selectTypeButton.addEventListener('click', function () {
        selectTypeClicked(type);
      }, false);

      settings.appendChild(selectTypeButton);
    };

    return settings;
  };

  /**
   * Return object with public functions
   */
  return {
    name: exportModuleName,
    version: version,
    render: render,
    validate: validate,
    save: save,
    makeSettings: makeSettings
  };
};
