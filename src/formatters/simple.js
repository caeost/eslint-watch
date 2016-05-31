import error from './helpers/error-warning';
import { endLine } from './helpers/characters';
import _ from 'lodash';

export default (results) => {
  return _.reduce(results, (message, result) =>{
    if (result.errorCount !== 0 || result.warningCount !== 0) {
      message += `${error(result)}${endLine}`;
    }
    return message;
  },'');
};
