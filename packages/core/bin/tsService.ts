#!/usr/bin/env node
/* eslint-disable no-console */

import figlet from 'figlet';
import chalk from 'chalk';
import clear from 'clear';
import program from 'commander';

import packageJson from '../package.json';
import initConfigs from '../src/initConfigs';
import initService from '../src/initService';
import ServiceType from '../src/models/ServiceType';

clear();

console.log(chalk.red(figlet.textSync('@sometingTechnology', { horizontalLayout: 'full' })));
console.log(chalk.red(figlet.textSync('init microservice', { horizontalLayout: 'full' })));

program
  .version(packageJson.version)
  .description('A CLI for creating typescript microservices with ease.');

program
  .command('init-configs <target>')
  .alias('ic')
  .description('create initial configurations for typescript microservices/projects')
  .option('--type <type>', 'Type of the service: react, service, react-native', 'service')
  .action((target, options) => {
    try {
      initConfigs(target, options.type);
    } catch (e) {
      throw new Error(e);
      process.exit(1);
    }
  });

program
  .command('init <target>')
  .alias('i')
  .description('create initial setup for typescript microservices/projects')
  .option('--type <type>', 'Type of the service: react, service, react-native', ServiceType.SERVICE)
  .action((target, options) => {
    try {
      initService({ target, type: options.type });
    } catch (e) {
      throw new Error(e);
      process.exit(1);
    }
  });

// allow commander to parse `process.argv`
program.parse(process.argv);
