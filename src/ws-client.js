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


function session(login) {
  const chat = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'chat > '
  })

  const url = 'ws://127.0.0.1:8081'
  const connection = new WebSocket(url)

  connection.onopen = () => {
    connection.send(JSON.stringify({username: login}))
  }

  connection.onerror = error => {
    console.log(`WebSocket ERROREEE: ${error}`)
  }

  connection.on('message', message => {
    console.log(`server: ${message}`);
  })

  const chatCycle = () => {
    chat.prompt()
    chat.on('line', message => {
      connection.send(JSON.stringify({message}))
      chat.prompt()
    })
  }
  setTimeout(chatCycle, 1000)
}
