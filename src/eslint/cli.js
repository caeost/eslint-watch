var executer = require('../executer');
var path = require('path');
var os = require('os');
var fs = require('fs');

var logger = require('../log')('eslint-cli');
logger.debug('Loaded');

var cmd = os.platform() === 'win32' ? '.cmd' : '';

var eslint = (function loadEslintPath(){
  var eslintPath;
  try {
    eslintPath = path.resolve('./node_modules/.bin/eslint' + cmd);
    fs.accessSync(eslintPath);
  } catch (e) {
    eslintPath = path.resolve(process.env._, '../eslint' + cmd);
    fs.accessSync(eslintPath);
  }
  logger.debug(eslintPath);
  return eslintPath;
})();

logger.debug('EsLint path: %s', eslint);
var spawn = executer.spawn;

module.exports = function(args, options, childOptions){
  if(!options){
    options = { _: './' };
  }
  if(options._ && options._.length === 0){
    options._ = './';
  }
  logger.debug('eslint: %o', args);
  return spawn('eslint', args, childOptions)
    .then(function(result){
      console.log(result)
      return result.data;
    }).catch(e =>{
      console.log(e)
      throw e;
      // console.log('ESLINT HELP ERROR', e);
    });
};
