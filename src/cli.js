/* eslint no-process-exit: 0*/
var keypress = require('keypress');

var eslint = require('./eslint');
var getOptions = require('./options');
var watcher = require('./watcher');
var argParser = require('./arg-parser');
var logger = require('./logger')('esw-cli');
var pkg = require('../package');

logger.debug('Loaded');
logger.debug('Eslint-Watch: ' + pkg.version);

var parsedOptions;
var eslArgs;
var exitCode;

function runLint(args, options){
  logger.debug(args);
  return eslint.execute(args, options);
}

async function keyListener(args, options){
  var stdin = process.stdin;
  if(!stdin.setRawMode){
    logger.debug('Process might be wrapped exiting keybinding');
    return;
  }
  keypress(stdin);
  stdin.on('keypress', async function(ch, key){
    logger.debug('%s was pressed', key.name);
    if(key.name === 'return'){
      logger.debug('relinting...');
      logger.debug(options);
      await runLint(args, options);
    }
    if(key.ctrl && key.name === 'c') {
      process.exit();
    }
  });
  stdin.setRawMode(true);
  stdin.resume();
}

process.on('exit', function () {
  process.exit(exitCode);
});

export default async () =>{
  let options = await getOptions();
  logger.debug(options);
  var args = process.argv;

  logger.debug('Arguments passed: %o', args);
  parsedOptions = options.parse(args);

  logger.debug('Parsing args');
  eslArgs = argParser.parse(args, parsedOptions);

  if (!parsedOptions.help) {
    logger.debug('Running initial lint');
    await runLint(eslArgs, parsedOptions);
    if (parsedOptions.watch) {
      logger.debug('Watch enabled');
      keyListener(eslArgs, parsedOptions);
      watcher(parsedOptions);
    }
  } else {
    logger.log(options.generateHelp());
  }
};
