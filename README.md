# @something.technology Monorepo

This monorepo provides some basic packages to make development of typescript based projects a little bit easier by providing out of the box solutions.

## Lerna Commands

**Add dependency to just one package:**

`yarn lerna add <dependency_to_add> --scope=@something.technology/<package>`

**Add dev-dependency to just one package:**

`yarn lerna add <dependency_to_add> --dev --scope=@something.technology/<package>`

**Bootstrap everything**

`npx lerna bootstrap`