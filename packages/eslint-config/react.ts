import sharedRules from './rules/sharedRules';
import reactRules from './rules/react';

module.exports = {
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'prettier/react',
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
