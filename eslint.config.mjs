import CodeX from 'eslint-config-codex';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  ...CodeX,

  {
    ignores: ['vite.config.ts', 'postcss.config.js'],
  },

  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    rules: {
      'n/no-unpublished-import': ['error', {
        allowModules: [
          'eslint-config-codex',
        ],
        ignoreTypeImport: true,
      }],
      'n/no-missing-import': 'off',
    },
  },
];
