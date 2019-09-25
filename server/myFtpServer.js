import net from 'net';
import fs from 'fs';
import path from 'path';
import { log, isallowedFtpCmd, isallowedFtpCmdLogged } from '../common/utils';
import dbUser from '../config/db.json';
import { exec } from 'child_process';

const port = process.argv[2] || 8080;

class Server {
    create(port, callback) {
        let instance = net.createServer(callback);

        instance.on('error', (err) => {
            console.error(err);
        });

        instance.on('close', () => {
            console.log('Server just died');
        });

        instance.listen(port, () => {
            console.log(`Server started on port ${port}`);
        })
    }
}

class FtpServer extends Server {
    constructor() {
        super();
        this.port = port;
        this.ROOT_FTP_DIRECTORY = path.join(process.cwd(), 'shared');
    }

    start() {
        super.create(this.port, socket => {
            console.log('Socket connected');
            socket.setEncoding('ascii');
            socket.session = {
                username: "st2diio",
                isConnected: true
            }
            this.checkDir(socket, "st2diio")
            socket.on('close', () => {
                console.log('Socket disconnected');
            });
            socket.on('end', () => {
                log('Client disconnected', "cyan");
                process.exit(0);
            })
            socket.on('data', (data) => {
                data = data.trim();
                let [cmd, ...args] = data.split(' ');
                if(!isallowedFtpCmdLogged(cmd)){
                    console.log(cmd);
                    socket.write(`This command is not available. Login first for better luck!`);
                    return
                }
                if ((!socket.session || !socket.session.isConnected) && !isallowedFtpCmd(cmd)){
                    socket.write(`You need to login foo`);
                    return
                }
                cmd = cmd.toLowerCase();
                this[cmd](socket, ...args);
            });
        });
    }

    quit(socket) {
        socket.end();
    }

    user(socket, username) {
        const user = dbUser.find(user => user.username === username);
        if (!user) {
            socket.write("Account needed")
        } else {
            socket.session = {
                username,
                isConnected: false
            }
            socket.write(`Username <${username}> ok -- password needed`);
        }
    }

    pass(socket, password) {
        if (!socket.session) {
            socket.write('Login first');
            return
        }
        const user = dbUser.find(user => socket.session.username === user.username);
        if (user.password === password) {
            socket.session.isConnected = true;
            this.checkDir(socket,user.username);
            socket.write(`Password accepted, you're logged`);
        } else {
            socket.write('Wrong password, Run!');
        }
    }

    list(socket){
        let root_dir = socket.session.directory.split('/');
        root_dir.pop();
        const user_current_dir = socket.session.pwd;
        // console.log("user_current_dir: ",user_current_dir)
        // console.log("root_dir: ", root_dir);

        console.log(path.join(root_dir.join('/'), user_current_dir))
        // exec(`ls -l /shared${user_current_dir}`, (err, stdout, stderr)=>{
        //     console.log(stdout)
        //     socket.write(stdout);
        // });
        exec(`ls -l ${path.join(root_dir.join('/'), user_current_dir)}`, (e, stdout, stderr) => {
            socket.write(stdout)
        })
    }

    checkDir(socket, username) {
        const dir = path.join(this.ROOT_FTP_DIRECTORY, username);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
            console.log(dir);

        }
        socket.session.directory = dir;
        socket.session.pwd = `/${username}`;
    }

    pwd(socket) {
        socket.write(socket.session.pwd);
    }

    help(socket) {
        const str = `
        Foo u need sum help :

        - USER <username>: check if the user exist
        - PASS <password>: authenticate the user with a password
        - LIST: list the current directory of the server
        - CWD <directory>: change the current directory of the server
        - RETR <filename>: transfer a copy of the file FILE from the server to the client
        - STOR <filename>: transfer a copy of the file FILE from the client to the server
        - PWD: display the name of the current directory of the server
        - HELP: send helpful information to the client
        - QUIT: close the connection and stop the program
        `
        socket.write(str);
    }
}

let ftp = new FtpServer();
ftp.start();