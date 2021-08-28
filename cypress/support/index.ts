// ***********************************************************
// This example support/index.test.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
// import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import EditorJS, {BlockToolConstructable, EditorConfig} from "@editorjs/editorjs";
import Chainable = Cypress.Chainable;

Cypress.Commands.add('initEditor', (config?: EditorConfig) => {
  /**
   * Open webpage
   */
  cy.visit('cypress/fixtures/index.html');

  return cy.window()
    .then(win => {
      /**
       * Compose editor config
       */
      const editorConfig: EditorConfig = {
        ...config,
        tools: {
          header: {
            class: win.Header,
            inlineToolbar: true,
            ...config?.tools?.header,
          },
          ...config?.tools,
        }
      }

      /**
       * Create new editor
       */
      const editor = new win.EditorJS(editorConfig);

      /**
       * Wait until editor is ready and return it
       */
      return new Promise(async resolve => {
        await editor.isReady;

        resolve(editor);
      })
    });
})

Cypress.Commands.add('getEditor', () => {
  return cy.get('[data-cy=editorjs]');
});

Cypress.Commands.add('getBlock', (index = 0) => {
  return cy.getEditor()
    .find('div.ce-block')
    .eq(index)
    .click();
});

Cypress.Commands.add('openTunes', {prevSubject: 'element'}, () => {
  cy.getEditor()
    .find('.ce-toolbar__actions-buttons')
    .click();

  return cy.getEditor()
    .find('.ce-settings');
});

Cypress.Commands.add('tab', (shift = false) => {
  cy.document()
    .then(doc => {
      const activeElement = doc.activeElement;

      cy.window()
        .then(win => {
          const keyboardEventParams = {
            key: 'Tab',
            code: 'Tab',
            keyCode: 9,
            which: 9,
            charCode: 0,
            bubbles: true,
            cancelable: true,
            altKey: false,
            ctrlKey: false,
            metaKey: false,
            shiftKey: shift,
          };
          const keyboardEvent = new win.KeyboardEvent('keydown', keyboardEventParams);
          const element = activeElement || doc;

          element.dispatchEvent(keyboardEvent);
        })
    });
});

declare global {
  namespace Cypress {
    interface Chainable {
      initEditor(config?: EditorConfig): Chainable<EditorJS>;

      getEditor(): Chainable<JQuery<HTMLDivElement>>;

      getBlock(index?: number): Chainable<JQuery<HTMLDivElement>>;

      openTunes(): Chainable<JQuery<HTMLDivElement>>;

      tab(shift?: boolean): Chainable;
    }

    interface ApplicationWindow {
      EditorJS: typeof EditorJS;

      Header: BlockToolConstructable;
    }
  }
}
