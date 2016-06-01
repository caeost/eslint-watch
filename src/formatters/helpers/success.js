import { green, white } from 'chalk';
import c from './characters';
import Logger from '../../logger';

var logger = Logger('success-formatter');
logger.debug('loaded');

export default (result) => {
  logger.debug(result);
  return `${green(c.check)} ${white(result.filePath)}`;
};
