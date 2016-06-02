var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var _ = require('lodash');
var executer = require('../../src/executer');
var help = require('../../src/eslint/help');

describe('eslint/help', function(){
  var title = 'title with options';
  var optionsTxt = 'Options:';
  var helpTxt = '--help      This has no alias or type';
  var cluck = '-c --cluck Boolean     Goes Cluck';
  var noAlias = '--see String     no alias';
  var noType = '-n --nope      no type to be found here';
  var noColor = '  --no-color                  Disable color in piped output';
  var doubleExample = '--color, --no-color       Enables or disables color piped output';
  var msg;

  function resolve(msg){
    executer.spawn = () => Promise.resolve({ statusCode: 0, data: msg });
  }

  beforeEach(function(){
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        helpTxt + '\n' +
        cluck + '\n' +
        noAlias + '\n' +
        noType + '\n';
    resolve(msg);
  });

  it('has an alias if one is provided', function(){
    return help()
      .then((options) =>{
        var option = options[0];
        expect(option.alias).to.equal('c');
      });
  });

  it('does not have an alias if not provided', function(){
    return help()
      .then((options) =>{
        var option = options[1];
        expect(option.alias).to.equal(undefined);
      });
  });

  it('has a type', function(){
    return help()
      .then((options) =>{
        var option = options[0];
        expect(option.type).to.equal('Boolean');
      });
  });

  it('has a full description', function(){
    return help()
      .then((options) =>{
        var option = options[0];
        expect(option.description).to.equal('Goes Cluck');
      });
  });

  it('filters out help', function(){
    return help()
      .then((options) =>{
        _.each(options, function(option){
          assert.notEqual(option.option, 'help');
        });
    });
  });

  it('filters out format', function(){
    msg += '-f --format String     Stringify' + '\n';
    return help()
      .then(options =>{
        _.each(options, function(option){
          expect(option.option).to.not.equal('format');
        });
    });
  });

  it("doesn't set an option as undefined", function(){
    return help()
      .then((options) =>{
        _.each(options, function(option){
          expect(option.option).to.be.ok;
        });
    });
  });

  it("doesn't set an alias as undefined", function(){
    resolve(title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        helpTxt + '\n' +
        cluck + '\n');
    return help()
      .then((options) =>{
        _.each(options, function(option){
          expect(option.alias).to.be.ok;
        });
      });
  });

  it("doesn't set a type as undefined", function(){
    return help()
      .then((options) =>{
        _.each(options, function(option){
          expect(option.type).to.be.ok;
        });
      });
  });

  it("doesn't set a description as undefined", function(){
    return help()
      .then((options) =>{
        _.each(options, (option) => {
          expect(option.description).to.be.ok;
        });
      });
  });

  it("sets the default to Boolean if type isn't provided", function(){
    return help()
      .then((options) =>{
        var option = options[2];
        expect(option.type).to.equal('Boolean');
      });
  });

  it("shouldn't throw exceptions", function(){
    resolve(title + '\n' +
       '\n' +
       optionsTxt + '\n' +
       helpTxt + '\n' +
       '\n' +
       'HEADING:\n'+
       cluck + '\n');
    return help()
      .then(options =>{
        var option = options[0];
        expect(option.type).to.equal('Boolean');
      });
  });

  it('filters out no from help options', function() {
    resolve(title + '\n' +
       '\n' +
       optionsTxt + '\n' +
       helpTxt + '\n' +
       '\n' +
       'HEADING:\n'+
       noColor + '\n');
    return help()
      .then((options) => {
        var colorOption = options[0];
        expect(colorOption.option).to.equal('color');
      });
  });

  it('defaults no options to true', function(){
    resolve(title + '\n' +
       '\n' +
       optionsTxt + '\n' +
       helpTxt + '\n' +
       '\n' +
       'HEADING:\n'+
       noColor + '\n');

    return help()
      .then((options) => {
        var colorOption = options[0];
        expect(colorOption.default).to.equal('true');
       });
  });

  it('can parse doubled option options', function(){
    resolve(title + '\n' +
       '\n' +
       optionsTxt + '\n' +
       helpTxt + '\n' +
       '\n' +
       'HEADING:\n'+
       doubleExample + '\n');

    return help()
      .then((options) =>{
         var colorOption = options[0];
         expect(colorOption).to.eql({
           option: 'color',
           type: 'Boolean',
           alias: 'no-color',
           description: 'Enables or disables color piped output'
         });
       });
  });
});
