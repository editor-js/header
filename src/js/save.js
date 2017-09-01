'use strict';

/**
 * Method to extract JSON data from HTML block
 *
 * @param block
 */

module.exports = (element) => {
  let data = {
    'heading-styles': element.tagName,
    'text': element.textContent || ''
  };

  return data;
};
