import { expect } from 'chai';
import formatter from '../../src/formatters/simple-detail';
import { ex, x, check } from '../../src/formatters/helpers/characters';
import chalk from 'chalk';
import sinon from 'sinon';

describe('simple-detail', () => {
  let sandbox;
  let errorResult;
  let warningResult;
  let filePath;

  before(() =>{
    sandbox = sinon.sandbox.create();
    const format = {
      open: '',
      close: '',
      closeRe: ''
    };
    sandbox.stub(chalk.styles, 'green', format);
    sandbox.stub(chalk.styles, 'white', format);
    sandbox.stub(chalk.styles, 'dim', format);
    sandbox.stub(chalk.styles, 'gray', format);
    sandbox.stub(chalk.styles, 'yellow', format);
    sandbox.stub(chalk.styles, 'red', format);
    sandbox.stub(chalk.styles, 'underline', format);
  });

  beforeEach(() =>{
    filePath = '/some/file/path';
    errorResult = {
      errorCount: 1,
      warningCount: 0,
      messages: [{
        fatal: true,
        message: 'broken something or other',
        ruleId: 'broken-things'
      }],
      filePath: filePath
    };
    warningResult = {
      errorCount: 0,
      warningCount: 1,
      messages: [{
        fatal: false,
        line: 1,
        column: 2,
        message: 'you should do this',
        ruleId: 'advised'
      }],
      filePath: filePath
    };
  });

  after(() =>{
    sandbox.restore();
  });

  describe('clean', () => {
    // Possible this test might fail. haha oh well...
    // Works for now.
    it('prints out a checkmark with the date', () =>{
      let time = new Date().toLocaleTimeString();
      let result = formatter([]);
      expect(result).to.equal(`${check} Clean (${time})\n`);
    });
  });

  describe('errors', () => {
    // can break sometimes
    it('prints out errors if there are any', () =>{
      let time = new Date().toLocaleTimeString();
      let result = formatter([errorResult]);
      expect(result).to.equal(`${filePath} (1/0)\n  ${x}  0:0  broken something or other  broken-things\n\n${x} 1 error (${time})\n`);
    });

    it('prints out errors if there are multiple', () =>{
      let result = formatter([errorResult, errorResult]);
      expect(result).to.includes('errors');
    });
  });

  describe('warnings', function(){
    // can break
    it('prints out any warnings if there are any', () =>{
      let time = new Date().toLocaleTimeString();
      let result = formatter([warningResult]);
      expect(result).to.equal(`${filePath} (0/1)\n  ${ex}  1:2  you should do this  advised\n\n${ex} 1 warning (${time})\n`);
    });

    it('prints out warnings if there are multiple', () => {
      let result = formatter([warningResult, warningResult]);
      expect(result).to.include('warnings');
    });
  });

  describe('errors/warnings', () =>{
    it('prints out warnings and errors', () =>{
      let result = formatter([errorResult, warningResult]);
      expect(result).to.include('1 error');
      expect(result).to.include('1 warning');
    });

    it('prints out both errors and warnings', () =>{
      let result = formatter([errorResult, errorResult, warningResult, warningResult]);
      expect(result).to.include('2 warnings');
      expect(result).to.include('2 errors');
    });

    it('prints out both errors and warnings for one file', () => {
      const results = [{
        errorCount: 1,
        warningCount: 1,
        messages: [{
          fatal: false,
          line: 1,
          column: 2,
          message: 'you should do this',
          ruleId: 'advised'
        },
        {
          fatal: true,
          line: 3,
          column: 2,
          message: 'you should do this',
          ruleId: 'required'
        }],
        filePath: filePath
      }];
      let result = formatter(results);
      expect(result).to.include('(1/1)');
      expect(result).to.include('1 warning');
      expect(result).to.include('1 error');
      expect(result).to.include('required');
      expect(result).to.not.include('undefined');
    });
  });
});
