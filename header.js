var codexEditorHeader =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

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

	    } else if (true) {

	        __webpack_require__(1)(name, definition);

	    } else {

	        root[name] = definition();

	    }

	}(this, 'codexEditorHeader', function () {

	    'use strict';

	    /**
	     * Styleheets
	     */
	    __webpack_require__(2);

	    var settings = __webpack_require__(4);

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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

	/**
	 * Interface for Header tool
	 * @author CodeX Team
	 */
	module.exports = function (settings) {

	    'use strict';

	    /**
	     * @private
	     */
	    var methods_ = {

	        /**
	         * Binds click event to passed button
	         */
	        addSelectTypeClickListener : function (el, type) {

	            el.addEventListener('click', function () {

	                methods_.selectTypeClicked(type);

	            }, false);

	        },

	        /**
	         * Replaces old header with new type
	         * @params {string} type - new header tagName: H1—H6
	         */
	        selectTypeClicked : function (type) {

	            var oldHeader, newHeader;

	            /** Now current header stored as a currentNode */
	            oldHeader = codex.editor.content.currentNode.querySelector('[contentEditable]');

	            /** Making new header */
	            newHeader = codex.editor.draw.node(type, [ 'ce-header' ], { innerHTML : oldHeader.innerHTML });
	            newHeader.contentEditable = true;
	            newHeader.setAttribute('data-placeholder', 'Заголовок');
	            newHeader.dataset.headerData = type;

	            codex.editor.content.switchBlock(oldHeader, newHeader, 'header');

	            /** Close settings after replacing */
	            codex.editor.toolbar.settings.close();

	        }

	    };

	    /**
	     * Settings panel content
	     *  - - - - - - - - - - - - -
	     * | настройки   H1  H2  H3  |
	     *  - - - - - - - - - - - - -
	     * @return {Element} element contains all settings
	     */
	    settings.makeSettings = function () {

	        var holder  = codex.editor.draw.node('DIV', [ 'cdx-plugin-settings--horisontal' ], {} ),
	            types   = {
	                h2: 'H2',
	                h3: 'H3',
	                h4: 'H4'
	            },
	            selectTypeButton;

	        /** Now add type selectors */
	        for (var type in types){

	            selectTypeButton = codex.editor.draw.node('SPAN', [ 'cdx-plugin-settings__item' ], { textContent : types[type] });
	            methods_.addSelectTypeClickListener(selectTypeButton, type);
	            holder.appendChild(selectTypeButton);

	        }

	        return holder;

	    };

	    return settings;

	}({});

/***/ })
/******/ ]);