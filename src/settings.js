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