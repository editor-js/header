/**
 * Header
 * Tool for CodeX Editor
 *
 * @author CodeX Team
 * @version 1.0.0
 * @see https://github.com/codex-editor/header
 *
 * @description Provides public interface methods
 */
!function (root, name, definition) {

    if (typeof module != 'undefined' && module.exports) {

        module.exports = definition();

    } else if (typeof define == 'function' && define.amd) {

        define(name, definition);

    } else {

        root[name] = definition();

    }

}(this, 'codexEditorHeader', function () {

    'use strict';

    /**
     * Styleheets
     */
    require('./css/styles.css');

    var settings = require('./settings');

    function destroy() {

    }

    /**
     * Settings panel content
     *  - - - - - - - - - - - - -
     * | настройки   H1  H2  H3  |
     *  - - - - - - - - - - - - -
     * @return {Element} element contains all settings
     */
    function makeSettings() {

        return settings.makeSettings();

    }

    /**
     * Prepares plugin
     * @param  {Object} config
     * @return {Promise}
     */
    function prepare(config) {

        return Promise.resolve().then(function () {

        });

    }

    /**
     * @return {Element} header tool block
     */
    function render( toolData ) {

        var availableTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            tag,
            headerType = 'h2';


        if ( toolData && toolData['heading-styles'] && availableTypes.includes(toolData['heading-styles']) ) {

            headerType = toolData['heading-styles'];

        }

        tag = document.createElement(headerType);

        /**
         * Save header type in data-attr.
         * We need it in save method to extract type from HTML to JSON
         */
        tag.dataset.headerData = headerType;


        if (toolData && toolData.text) {

            tag.textContent = toolData.text;

        }

        if (!tag.dataset.headerData) {

            tag.dataset.headerData = 'h2';

        }

        tag.classList.add('ce-header');
        tag.setAttribute('data-placeholder', 'Заголовок');
        tag.contentEditable = true;

        return tag;

    }

    /**
     * Saving method
     * @param  {Element} block   - plugin content
     * @return {Object}          - header data
     */
    function save( block ) {

        var data = {
            'heading-styles': block.dataset.headerData,
            'format': 'html',
            'text': block.textContent || ''
        };

        return data;

    }

    function validate( data ) {

        if (data.text.trim() === '' || data[ 'heading-styles' ].trim() === ''){

            return false;

        }

        return true;

    };

    return {
        destroy, makeSettings, prepare, render, save,  validate
    };

});