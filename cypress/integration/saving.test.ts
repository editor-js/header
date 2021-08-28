import EditorJS, {OutputData} from "@editorjs/editorjs";

describe('Saving', () => {
  beforeEach(function () {
    /**
     * Init editor with an empty header block
     */
    cy.fixture('editor-config-empty-block')
      .then(editorConfig => {
        cy.initEditor(editorConfig).as('EditorJS');
      });
  })

  it('should save correct type', function () {
    const headerContent = 'CodeX Team';

    cy.getBlock()
      .type(headerContent);

    cy.get<EditorJS>('@EditorJS')
      .then(editor => {
        editor.save()
          .then((data: OutputData)  => {
            console.log(data);
            expect(data.blocks[0].type).to.eq('header');
          });
      })
  });

  it('should save correct data', function () {
    const headerContent = 'CodeX Team';

    cy.getBlock()
      .type(headerContent);

    cy.get<EditorJS>('@EditorJS')
      .then(editor => {
        editor.save()
          .then((data: OutputData)  => {
            console.log(data);
            expect(data.blocks[0].data.text).to.eq(headerContent);
          });
      })
  });

  it('should save correct level', function () {
    const headerContent = 'CodeX Team';

    cy.getBlock()
      .type(headerContent);

    cy.get<EditorJS>('@EditorJS')
      .then(editor => {
        editor.save()
          .then((data: OutputData)  => {
            console.log(data);
            expect(data.blocks[0].data.level).to.eq(2);
          });
      })
  });
});
