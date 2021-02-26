import sharedRules from './rules/sharedRules';
import reactRules from './rules/react';

module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript',
    'plugin:jest/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['react-hooks', 'jest'],
  env: {
    jest: true,
  },
  ignorePatterns: ['**/*.d.ts'],
  rules: {
    ...sharedRules,
    ...reactRules,
  },
  settings: {
    jest: {
      version: 26,
    },
  },
};
