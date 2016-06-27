'use strict';

var Logger = require('../../log');
var logger = Logger('single-file');
var success = require('./formatters/helpers/success');
var formatter = require('./formatters/simple-detail');
var chalk = require('chalk');
var _ = require('lodash');
var path = require('path');

function successMessage(result) {
  logger.debug('result: %o', result);
  if (!result.errorCount && !result.warningCount) {
    return success(result) + chalk.grey(' (' + new Date().toLocaleTimeString() + ')');
  }
  return '';
}

function isWatchableExtension(cli, filePath, extensions) {
  logger.debug(filePath, extensions);
  if (extensions) {
    return _.includes(extensions, path.extname(filePath));
  }

  // Use the ESLint default extension, if none is provided
  return _.includes(cli.options.extensions, path.extname(filePath));
}

module.exports = {
  assert: function(options){
    return !options.lintAll;
  },
  exec: function(cli, path, options){
    if (!cli.isPathIgnored(path) && isWatchableExtension(cli, path, options.ext)) {
      var results = cli.executeOnFiles([path]).results;
      logger.log(successMessage(results[0]));
      logger.log(formatter(results));
    }
  }
};
