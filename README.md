# @something.technology Monorepo

This monorepo provides some basic packages to make development of typescript based projects a little bit easier by providing out of the box solutions.

## Packages

- [@something.technology/core](packages/core)
- [@something.technology/eslint-config](packages/eslint-config)
- [@something.technology/microservice-utilities](packages/microservice-utilities)
- [@something.technology/prettier-config](packages/prettier-config)
- [@something.technology/redux-connector](packages/redux-connector)
- [@something.technology/socket-connector](packages/socket-connector)
- [@something.technology/ts-config](packages/ts-config)

## Lerna Commands

**Add dependency to just one package:**

`yarn lerna add <dependency_to_add> --scope=@something.technology/<package>`

**Add dev-dependency to just one package:**

`yarn lerna add <dependency_to_add> --dev --scope=@something.technology/<package>`

**Bootstrap everything**

`npx lerna bootstrap`
