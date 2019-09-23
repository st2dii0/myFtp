# My FTP##

## <a name='overview'>🦁 Team</a>

- Quentin GUICHAOUA
- Steeve RANDRIAMAMPIANINA

## <a name='overview'>🐱 Overview</a>

The purpose of this challenge is to create an FTP client and server.
You **CAN** use any protocol you want [ if interested, you can check and respect the RFCs ]

## <a name='story'>🐨 Story</a>

#### Hi, server

##### Usage

```sh
~/codingbad/network/myFtp ❯❯❯ node myFtpServer.js <port>
```

- `port` is the port number on which the server socket is listening.
  > The server **must** be able to handle several clients at the same time.

#### Yo, client

##### Usage

```sh
~/codingbad/network/myFtp ❯❯❯ node myFtpClient.js <host> <port>
```

- host is the name (or the IP address) of the computer where the server is hosted.
- `port` is the port number on which the server is listening.

#### Commands

The client must handle the following commands:

- `USER <username>`: check if the user exist
- `PASS <password>`: authenticate the user with a password
- `LIST`: list the current directory of the server
- `CWD <directory>`: change the current directory of the server
- `RETR <filename>`: transfer a copy of the file _FILE_ from the server to the client
- `STOR <filename>`: transfer a copy of the file _FILE_ from the client to the server
- `PWD`: display the name of the current directory of the server
- `HELP`: send helpful information to the client
- `QUIT`: close the connection and stop the program

#### Requirements

The client must match the following requirements:

- Display a specific prompt to differentiate it from the shell
- Handle the file system security to not allow a user to browse a forbidden directory

## <a name='gui'>🦋 GUI</a>

Well, let use [**Electron**](https://electronjs.org) to have a modern client :)

> If your CLI client is well designed, you already have all functions and you'll focus on GUI.

## <a name='bonus'>🦄 Bonus</a>

In bulk:

- lcd + lpwd + lls commands
- mget + mput commands
- handle the "bin" and "asc" modes
- completion for get and put commands
- Compliance with the RFC
- Mobile client