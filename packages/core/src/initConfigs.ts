#!/usr/bin/env node
/* eslint-disable no-console */
import path from 'path';
import { cp, mkdir } from 'shelljs';
import chalk from 'chalk';
import ServiceType from './models/ServiceType';
import { PRETTIER_FILENAME, ESLINT_FILENAME, TSCONFIG_FILENAME } from './constants';

const initConfigs = (target: string, type = ServiceType.SERVICE): void => {
  const targetFolder = path.resolve(target);
  const isReactProject = type.includes('react');

  const generalTemplateFolder = path.resolve(path.join(__dirname, '../templates'));
  const templateFolder = path.resolve(
    path.join(generalTemplateFolder, isReactProject ? 'react' : 'service')
  );

  mkdir('-p', targetFolder);
  // TODO: ask if file should be overridden when already existing
  cp(
    '-Rf',
    path.join(templateFolder, PRETTIER_FILENAME),
    path.join(targetFolder, PRETTIER_FILENAME)
  );
  cp('-Rf', path.join(templateFolder, ESLINT_FILENAME), path.join(targetFolder, ESLINT_FILENAME));

  cp(
    '-Rf',
    path.join(generalTemplateFolder, TSCONFIG_FILENAME),
    path.join(targetFolder, TSCONFIG_FILENAME)
  );

  console.log(chalk.green(`Successfully created config files in ${targetFolder}`));
};

export default initConfigs;
