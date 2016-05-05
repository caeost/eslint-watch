import { expect } from 'chai';
import formatter from '../../../src/formatters/helpers/error-warning';
import chalk from 'chalk';
import sinon from 'sinon';

describe('error-warning-helper', () =>{
  let sandbox;

  before(() => {
    sandbox = sinon.sandbox.create();
    const format = {
      open: '',
      close: '',
      closeRe: ''
    };
    sandbox.stub(chalk.styles, 'red', format);
    sandbox.stub(chalk.styles, 'yellow', format);
    sandbox.stub(chalk.styles, 'white', format);
  });

  after(() =>{
    sandbox.restore();
  });

  it('prints error count if errorCount exists', () => {
    let object = { errorCount: 4, warningCount: 0, filePath: '/some/file/path' };
    let result = formatter(object);
    expect(result).to.equal('4/0 /some/file/path');
  });

  it('prints warning count if warningCount exists', () => {
    let object = { errorCount: 0, warningCount: 4, filePath: '/some/file/path' };
    let result = formatter(object);
    expect(result).to.equal('0/4 /some/file/path');
  });

  it('prints just errors when there are messages', () => {
    let object = { messages: ['hello', 'two'], filePath: '/some/file/path' };
    let result = formatter(object);
    expect(result).to.equal('2 /some/file/path');
  });
});
