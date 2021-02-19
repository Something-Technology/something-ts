/*
 * Copyright (c) 2021. Something Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

export const PRETTIER_FILENAME = '.prettierrc.js';
export const ESLINT_FILENAME = '.eslintrc.js';
export const TSCONFIG_FILENAME = 'tsconfig.json';
export const LICENSE_FILENAME = 'LICENSE';
export const GITIGNORE_FILENAME = '.gitignore';
export const SERVICE_INDEX_FILENAME = 'INDEX_TEMPLATE';

const DEV_PACKAGES = [
  '@something.technology/eslint-config',
  '@something.technology/prettier-config',
  '@something.technology/ts-config',
  '@typescript-eslint/eslint-plugin',
  'eslint',
  'eslint-config-prettier',
  'eslint-plugin-import',
  'eslint-plugin-jest',
  'eslint-plugin-prettier',
  'prettier',
  'typescript',
];
export const REACT_DEV_PACKAGES = [
  ...DEV_PACKAGES,
  'eslint-plugin-react',
  'eslint-plugin-react-hooks',
  'eslint-plugin-jsx-a11y',
];
export const SERVICE_DEV_PACKAGES = [...DEV_PACKAGES, '@types/express', 'ts-node'];

export const SERVICE_PACKAGES = ['@something.technology/microservice-utilities', 'express'];
export const REACT_PACKAGES = ['react'];
