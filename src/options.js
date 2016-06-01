var optionator = require('optionator');
var eslint = require('./eslint');
var _ = require('lodash');
var logger = require('./logger')('options');
logger.debug('Loaded');

var settings = {
  prepend: 'esw [options] [file.js ...] [dir ...]',
  concatRepeatedArrays: true,
  mergeRepeatedObjects: true
};

var myOptions = [{
  heading: 'Options'
}, {
  option: 'help',
  alias: 'h',
  type: 'Boolean',
  description: 'Show help'
}, {
  option: 'format',
  alias: 'f',
  type: 'String',
  default: 'simple-detail',
  description: 'Use a specific output format'
}, {
  option: 'watch',
  alias: 'w',
  type: 'Boolean',
  description: 'Enable file watch'
}];

export default async function(){
  // console.log('YAY')
  const eslintOptions = await eslint.getHelp();
  let options;
  let newOptions = _.union(myOptions, eslintOptions);
  settings.options = newOptions;

  try {
    options = optionator(settings);
    return options;
  } catch(e){
    logger.error(e);
    throw e;
  }
};
