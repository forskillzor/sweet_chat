'use strict'

const WebSocket = require('ws')
const readline = require('readline')

const loginPrompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

loginPrompt.question('login: ', l => {
  const login = l
  loginPrompt.close()
  session(login)
})

const encode = obj => JSON.stringify(obj)
const decode = str => JSON.parse(str)

const command = (command, value) => encode({
  commandName: command,
  commandValue: value
})

// TODO move from server to facade and separate to server
const server = {
  commands: {
    signin: 'signin',
    sendMessage: 'message',
    connectToUser: 'connectToUser',
    createRoom: 'createRoom',
    changeRoom: 'changeRoom'
  },
  setConnection: function (connection) {
    this.connection = connection
  },
  signin: function (user){
    this.user = user
    this.connection.send(command(this.commands.signin, this.user))
  },
  call: function (user) {
    this.connection.send(command(this.commands.connectToUser, user))
  },
  chroom: function (room) {
    this.connection.send(command(this.commands.changeRoom, room))
  },
  sendMessage: function (text) {
    this.connection.send(command(this.commands.sendMessage, text))
  },
  createRoom: function (roomName) {
    this.connection.send(command(this.commands.createRoom, roomName))
  },
}

function session(login) {
  const chat = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'chat > '
  })

  const url = 'ws://127.0.0.1:8081'
  const connection = new WebSocket(url)

  connection.onopen = () => {
    server.setConnection(connection)
    server.signin(login)
  }

  connection.onerror = error => {
    console.log(`WebSocket ERROREEE: ${error}`)
  }

  connection.on('message', message => {
    const decoded = decode(message)
    if (decoded.commandName === 'message')
      console.log(`${decoded.author} : ${decoded.commandValue}`);
  })

  const chatCycle = () => {
    chat.prompt()
    chat.on('line', message => {

      parseLine(message)
      chat.prompt()
    })
  }
  setTimeout(chatCycle, 1000)
}

/*
 * @ command parser
 */

function parseLine(str) {
  if (str[0] === '@'){
    const command = str.slice(1, str.indexOf('('))
    const param = str.slice(str.indexOf('(') + 1, str.indexOf(')'))
    //console.log('parsed command: ', command, 'param: ', param)
    try {
      server[command](param)
    }
    catch (e){
      console.log('not a command');
    }
  } else {
    server.sendMessage(str)
  }
}
