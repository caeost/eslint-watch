import child from 'child_process';
import _ from 'lodash';
import Promise from 'bluebird';
import Logger from './log';

const logger = Logger('exec');

const defaults = {
  env: process.env,
  stdio: null
};

const exec = child.exec;
const spawn = child.spawn;

export default {
  spawn(cmd, args, options){
    options = _.merge(options, defaults);
    return new Promise((resolve, reject) => {
      const data = [];
      const error = [];
      let child;
      try{
        child = spawn(cmd, args, options);
      } catch(e){
        console.log(e)
      }


      child.stdout.on('data', (line) =>{
        console.log(line)
        data.push(line);
      });

      child.stderr.on('data', (line) =>{
        console.log(line)
        error.push(line);
      });

      child.on('close', (code) =>{
        var results = {
          exitCode: code
        };
        if(data.length){
          console.log(data)
          results.data = data.join(' ').trim();
          resolve(results);
        }
        if(error.length){
          console.log(error)
          results.data = error.join(' ').trim();
          reject(results);
        }
      });

      child.on('error', (e) =>{
        logger.debug('SPAWN ERROR', e);
        reject(e);
      });
    });
  },
  exec(cmd, args, options){
    options = _.merge(options, defaults);
    return new Promise((resolve, reject) => {
      let data;
      let error;

      const child = exec(cmd, options, (err, stdout, stderr) =>{
        // console.log(err)
        if(err) return reject(err);
        data = stdout;
        error = stderr;
      });

      child.on('close', (code) =>{
        let results = {
          exitCode: code
        };
        if(data){
          // console.log('DATA')
          results.data = data.trim();
          resolve(results);
        }
        if(error){
          // console.log('ERROR')
          results.data = error.trim();
          reject(results);
        }
      });

      // child.on('exit', function(e){
      //   // console.log(e, error, data);
      // });

      child.on('error', (e) => {
        // console.log('EXEC ERROR:', e);
        reject(e);
      });
    });
  }
};
