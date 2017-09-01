'use strict';

/**
 * Method to extract JSON data from HTML block
 *
 * @param block
 */

module.exports = (element) => {
  let data = {
    'heading-styles': element.tagName,
    'format': 'html',
    'text': element.textContent || ''
  };

  return data;
};
