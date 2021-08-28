import {EditorConfig} from "@editorjs/editorjs";

describe('Tunes', () => {
  context('with default configuration', function () {
    beforeEach(function () {
      /**
       * Init editor with an empty header block
       */
      cy.fixture('editor-config-empty-block')
        .then(editorConfig => {
          cy.initEditor(editorConfig).as('EditorJS');
        })

      cy.getBlock()
        .openTunes();
    })

    it('render default items');

    it('tune click updates header level');

    it('tune click updates header level and tune icon highlights');
  })

  context('with user configuration', function () {

  })
});
