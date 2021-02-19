import { LintingLevel } from './constants';

export default {
  '@typescript-eslint/indent': LintingLevel.OFF, // Prettier handles this
  'max-len': [
    LintingLevel.ERROR,
    {
      code: 100,
      tabWidth: 2,
      ignoreStrings: true,
      ignoreComments: true,
      ignoreTemplateLiterals: true,
    },
  ],
  'no-tabs': LintingLevel.ERROR,
};
