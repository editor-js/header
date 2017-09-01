'use strict';

/**
 * Method to render HTML block from JSON
 *
 * @param data
 */

module.exports = function (data) {
  const elementClass = 'ce-header',
      placeholder = 'Title';

  let availableTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      headerType = 'h2';

  if (data && data['heading-styles'] && availableTypes.includes(data['heading-styles'])) {
    headerType = data['heading-styles'];
  }

  let element = document.createElement(headerType);

  if (data && data.text) {
    element.textContent = data.text;
  }

  element.classList.add(elementClass);
  element.setAttribute('data-placeholder', placeholder);
  element.contentEditable = true;

  return element;
};