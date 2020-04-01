'use strict'

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8081 })
const users = {}
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'chat > '
})

wss.on('connection', ws => {
  let username = '';
  ws.on('message', message => {
    const decodedMessage = JSON.parse(message)
    if (decodedMessage.hasOwnProperty('username')) {
      if ( ! (decodedMessage.username in users)) {
        users[decodedMessage.username] = null
        username = decodedMessage.username
        console.log('added new user: ', decodedMessage.username)
        console.log('Users are: ', users)
      }
    }
    else if (decodedMessage.hasOwnProperty('message')) {
      console.log(`${username}: ${decodedMessage.message}`)
    }
  })
  ws.send(`connected to server`)
  setTimeout(chat.bind(null, ws), 1000)
})

const chat = (ws) => {
  rl.prompt()
  rl.on('line', message => {
    ws.send(message)
    rl.prompt()
  })
}

