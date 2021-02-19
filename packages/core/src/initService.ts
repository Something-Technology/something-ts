#!/usr/bin/env node
/* eslint-disable no-console */

import path from 'path';
import { cp, mkdir } from 'shelljs';
import { execFileSync } from 'child_process';
import { writeFileSync } from 'fs';
import editJsonFile from 'edit-json-file';
import ServiceType from './models/ServiceType';
import initConfigs from './initConfigs';
import {
  ESLINT_FILENAME,
  GITIGNORE_FILENAME,
  LICENSE_FILENAME,
  REACT_DEV_PACKAGES,
  REACT_PACKAGES,
  SERVICE_DEV_PACKAGES,
  SERVICE_INDEX_FILENAME,
  SERVICE_PACKAGES,
} from './constants';

type InitService = {
  target: string;
  type?: ServiceType;
};

const initService = ({ target, type = ServiceType.SERVICE }: InitService): void => {
  const targetFolder = path.resolve(target);
  const templateFolder = path.resolve(path.join(__dirname, '../templates'));

  mkdir('-p', path.join(targetFolder, 'src'));

  writeFileSync(
    path.resolve(path.join(targetFolder, 'package.json')),
    JSON.stringify({ main: 'dist/index.js', license: 'MIT' })
  );
  execFileSync('yarn', ['init'], { stdio: 'inherit', cwd: targetFolder });

  initConfigs(targetFolder, type);

  // TODO: ask if file should be overridden when already existing
  cp('-Rf', path.join(templateFolder, LICENSE_FILENAME), path.join(targetFolder, LICENSE_FILENAME));
  cp(
    '-Rf',
    path.join(templateFolder, GITIGNORE_FILENAME),
    path.join(targetFolder, '.gitignore')
  );

  const isReactProject = type.includes('react');
  if (!isReactProject) {
    cp(
      '-Rf',
      path.join(templateFolder, 'service', SERVICE_INDEX_FILENAME),
      path.join(targetFolder, 'src', 'index.ts')
    );
  }

  // devDependencies
  execFileSync(
    'yarn',
    ['add', ...(isReactProject ? REACT_DEV_PACKAGES : SERVICE_DEV_PACKAGES), '--dev'],
    { stdio: 'inherit', cwd: targetFolder }
  );

  // Dependencies
  execFileSync('yarn', ['add', ...(isReactProject ? REACT_PACKAGES : SERVICE_PACKAGES)], {
    stdio: 'inherit',
    cwd: targetFolder,
  });

  const packageFile = editJsonFile(path.resolve(path.join(targetFolder, 'package.json')));

  // Scripts
  packageFile.set('scripts.build', 'rm -rf ./dist && tsc');
  packageFile.set('scripts.lint', `eslint -c ./${ESLINT_FILENAME} "*/**/*.ts" --max-warnings=0`);
  packageFile.set('scripts.lint:fix', 'yarn lint --fix');

  if (!isReactProject) {
    packageFile.set('scripts.serve:dev', 'ts-node ./src/index.ts');
  }

  packageFile.save();

  execFileSync('yarn', ['install', '--force'], { stdio: 'inherit', cwd: targetFolder });
};

export default initService;
