'use strict';

/**
 * Check output data for validity.
 * Should be defined by developer
 *
 * @param data
 */

module.exports = (data) => {
  let text = data.text.trim() === '',
      tag = data['heading-styles'].trim() === '';

  if (text || tag) {
    return false;
  }

  return true;
};
