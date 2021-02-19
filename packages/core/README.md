# @something.technology/core

Core package provides some basic scripts which are listed in the following

## Overview

To get an overview about whats possible with the core you can use the help option of the command:
```
npx @something.technology/core --help
```

## Init Service Script

This script initializes a basic microservice based on express with all the required configurations.
It also integrates some basic scripts not only for linting and building the microservice but also you should be able to run the service instantly by running `yarn serve:dev`,

**Command:**
```
npx @something.technology/core init <targetDirectory>
```

For example when initializing a new service  in the current working directory you can type: 
`npx @something.technology/core init .`.

**Options:**

option | possible values | default | description
--- | --- | --- | ---
--type \<type> | react / react-native / service | service | Type of the (micro)service you want to initialize

## Init Configs Script

This script initializes the basic config files for ESLint, Prettier and Typescript. 
Existing configurations may be overwritten when running this script.

**Command:**
```
npx @something.technology/core init-configs <targetDirectory>
```

For example when initializing a new service  in the current working directory you can type:
`npx @something.technology/core init .`.

**Options:**

option | possible values | default | description
--- | --- | --- | ---
--type \<type> | react / react-native / service | service | Type of the (micro)service you want to initialize
