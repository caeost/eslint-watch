import child from 'child_process';
import _ from 'lodash';
import Promise from 'bluebird';
import Logger from './logger';

const logger = Logger('exec');

const defaults = {
  // env: process.env,
  stdio: 'inherit'
};

const spawn = child.spawn;

export default {
  spawn: (cmd, args, options) =>{
    logger.log('YAYAYA')
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

      child.on('exit', () =>{
        console.log('EXITED')
      })

      child.on('error', (e) =>{
        logger.debug('SPAWN ERROR', e);
        reject(e);
      });
    }).catch(e =>{
      console.error('BROKEN SPAWN', e)
    });
  }
};
