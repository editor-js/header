import CodeX from 'eslint-config-codex';

export default [
  ...CodeX,

  {
    ignores: ['vite.config.ts', 'postcss.config.js', 'src/__mocks__/*'],
  },

  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
    rules: {
      'n/no-unpublished-import': ['error', {
        allowModules: ['eslint-config-codex'],
        ignoreTypeImport: true,
      }],
      'n/no-missing-import': ['error', {
        allowModules: ['@editorjs/model', '@editorjs/sdk', '@editorjs/dom-adapters'],
      }],
    },
  },

  {
    files: ['**/*.spec.ts'],
    rules: {
      'n/no-unpublished-import': ['error', {
        allowModules: ['@jest/globals'],
      }],
    },
  },
];
