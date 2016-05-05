import { expect } from 'chai';
import formatter from '../../../src/formatters/helpers/success';
import chalk from 'chalk';
import sinon from 'sinon';

describe('success-helper', () => {
  let sandbox;

  before(() => {
    sandbox = sinon.sandbox.create();
    const format = {
      open: '',
      close: '',
      closeRe: ''
    };
    sandbox.stub(chalk.styles, 'green', format);
    sandbox.stub(chalk.styles, 'white', format);
  });

  after(() => {
    sandbox.restore();
  });

  it('places a checkmark and the path', () =>{
    let object = { filePath: '/some/file/path' };
    let result = formatter(object);
    expect(result).to.equal('✓ /some/file/path');
  });
});
