import { LintingLevel } from './constants';

export default {
  'react-hooks/rules-of-hooks': LintingLevel.ERROR,
  'react-hooks/exhaustive-deps': LintingLevel.ERROR,
  'react/jsx-indent-props': LintingLevel.OFF, // Prettier handles this
  'react/jsx-indent': LintingLevel.OFF, // Prettier handles this
  'import/no-extraneous-dependencies': [
    LintingLevel.ERROR,
    {
      devDependencies: [
        './storybook/**',
        '.storybook/**',
        './e2e/**',
        '**/__mocks__/**',
        '**/*.{test,spec,stories}.{js,ts,tsx}',
      ],
    },
  ],
  'react/require-default-props': LintingLevel.OFF, // not needed with typescript
};
