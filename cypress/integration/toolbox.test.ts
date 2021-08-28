describe('Toolbox icon', () => {
  beforeEach(function () {
    cy.initEditor().as('EditorJS');
  })

  it('should render default icon', function () {
    cy.getBlock();

    cy.getEditor()
      .find('div.ce-toolbar__plus')
      .click();

    cy.getEditor()
      .find('li.ce-toolbox__button[data-tool=header]')
      .should('exist');
  });

  it('should render block on click on toolbox icon', function () {
    cy.getBlock();

    cy.getEditor()
      .find('div.ce-toolbar__plus')
      .click();

    cy.getEditor()
      .find('li.ce-toolbox__button[data-tool=header]')
      .click()

    cy.getEditor()
      .find('.ce-header')
      .should('exist');
  });
});
