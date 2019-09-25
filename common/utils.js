import chalk from 'chalk';

export function argv(){
    return process.argv.splice(2);
}

export function log(string, color='blue', withNewLine=true){
    let toReturn = chalk[color](string);
    if(withNewLine){
        console.log(toReturn);
    } else {
        process.stdout.write(toReturn);
    }
}

const allowedFtpCmdNotLog = [
    'QUIT',
    'HELP',
    'PASS',
    'USER'
]

const allowedFtpCmd = [ 
    'PWD',
    'LIST',
    'CWD',
    'RETR',
    'STOR'
]

export function isallowedFtpCmdLogged(cmd){
    return allowedFtpCmd.includes(cmd.toUpperCase()) || allowedFtpCmdNotLog.includes(cmd.toUpperCase());
}

export function isallowedFtpCmd(cmd){
    return allowedFtpCmdNotLog.includes(cmd.toUpperCase());
}