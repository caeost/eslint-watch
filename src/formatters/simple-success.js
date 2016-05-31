import success from './helpers/success';
import error from './helpers/error-warning';
import _ from 'lodash';

function isSuccess(result){
  return result.errorCount === 0 && result.warningCount === 0;
}

export default (results) => {
  return _.reduce(results, (message, result) => {
    return message += (isSuccess(result) ? success(result) : error(result)) + '\n';
  }, '');
};
