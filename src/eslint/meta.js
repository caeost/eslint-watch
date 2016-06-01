import path from 'path';
import fs from 'fs';
import os from 'os';
import Logger from '../logger';

const logger = Logger('eslint-meta');

const platform = os.platform();

const cmd = platform === 'win32' ? '.cmd' : '';

function loadEslintPath(){
  // console.log('LOADING ESLINT PATH')
  var eslintPath;
  try {
    eslintPath = path.resolve(__dirname, '../../node_modules/.bin/eslint' + cmd);
    fs.accessSync(eslintPath);
  } catch (e) {
    eslintPath = path.resolve(process.env._, '../eslint' + cmd);
    fs.accessSync(eslintPath);
  }
  logger.debug(eslintPath);
  // console.log('YAY IT TWRKS')
  return eslintPath;
}

const eslintPath = loadEslintPath();

export default {
  eslintPath
};
