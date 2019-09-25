import net from 'net';
import fs from 'fs';
import {argv, log} from '../common/utils';
import readLine from 'readline';

// const host = process.argv[2] || '127.0.0.1';
// const port = process.argv[3];

class FtpClient{
    constructor(host, port){
        this.host = host;
        this.port = port;
    }

    connect(){
        this.socket = net.createConnection({
            host: this.host,
            port: this.port}, ()=>{
                log('Client connected', "green");
                this.prompt();
            });

        this.socket.on('data', (data)=>{
            log(data.toString(), "blue");
            this.prompt();
        });
    }

    prompt(){
        log('>>> ', "white", false);
        const cmd = readLine.createInterface({
            input: process.stdin
        });
        cmd.on('line', (input)=>{
            this.socket.write(input);
            cmd.close();
        });
    }
}

const args = argv();

if(args.length != 2){
    log("Usage: { client.js <host> <port> }", "red")
    process.exit(0)
}

const [host, port] = args; 

const Client = new FtpClient(host, port);
Client.connect();