import { red, yellow, white } from 'chalk';

export default (result) =>{
  if(result.errorCount || result.warningCount){
    return `${red(result.errorCount)}/${yellow(result.warningCount)} ${white(result.filePath)}`;
  } else {
    return `${red(result.messages.length)} ${white(result.filePath)}`;
  }
};
