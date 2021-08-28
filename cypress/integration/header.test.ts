import {EditorConfig} from "@editorjs/editorjs";

describe('Header', () => {
  beforeEach(function () {
    /**
     * Init editor with an empty header block
     */
    cy.fixture('editor-config-empty-block')
      .then(editorConfig => {
        cy.initEditor(editorConfig).as('EditorJS');
      })
  })

  it('should type into block', () => {
    const headerContent = 'CodeX Team';

    cy.getBlock()
      .type(headerContent)
      .should('contain', headerContent);
  });
});
