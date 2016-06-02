import executer from '../executer';
import Logger from '../logger';
import { eslintPath } from './meta';

const logger = Logger('eslint-cli');

logger.debug('Loaded');

logger.debug('EsLint path: %s', eslintPath);

export default (args, options, childOptions) => {
  logger.debug('eslint: %o', args);

  return executer.spawn(eslintPath, args, childOptions)
    .then(function(result){
      if(result){
        return result.data;
      }
      throw new Error('No results returned from Eslint. Check and see if Eslint is installed.');
    });
};
