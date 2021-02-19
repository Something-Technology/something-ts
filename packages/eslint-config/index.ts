import { LintingLevel } from './rules/constants';
import sharedRules from './rules/sharedRules';

module.exports = {
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['jest'],
  env: {
    jest: true,
  },
  ignorePatterns: ['**/*.d.ts'],
  rules: {
    ...sharedRules,
    'import/no-extraneous-dependencies': [
      LintingLevel.ERROR,
      {
        devDependencies: ['**/__mocks__/**', '**/*.{test,spec}.{js,ts,tsx}'],
      },
    ],
  },
  settings: {
    jest: {
      version: 26,
    },
  },
};
