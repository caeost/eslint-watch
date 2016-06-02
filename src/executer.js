import { spawn } from 'child_process';
import _ from 'lodash';
import Promise from 'bluebird';

const defaults = {
  env: process.env
};

export default {
  spawn: (cmd, args, options) => {
    options = _.merge(options, defaults);
    return new Promise((resolve, reject) => {
      const data = [];
      const error = [];

      const child = spawn(cmd, args, options);
      child.stdout.on('data', (line) =>{
        data.push(line);
      });

      child.stderr.on('data', (line) =>{
        error.push(line);
      });

      child.on('close', (code) =>{
        var results = {
          exitCode: code
        };
        if(data.length){
          results.data = data.join(' ').trim();
          resolve(results);
        }
        if(error.length){
          results.data = error.join(' ').trim();
          resolve(results);
        }
      });

      child.on('error', (e) =>{
        reject(e);
      });
    });
  }
};
