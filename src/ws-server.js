'use strict';

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });
const users = {};
const rooms = {};
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'chat > '
});

const encode = obj => JSON.stringify(obj);
const decode = str => JSON.parse(str);

const command = (command, value, author) => encode({
  commandName: command,
  commandValue: value,
  author: author
});

const commands = {
  signin: function (username, user) {
    user.name = username;
    users[username] = user;
    user.rooms = [];
    console.log('signin:', users[username].name)
  },
  message: function (text, user) {
    if (user.currentRoom) {
    console.log(user.name,':', user.currentRoom, ':', text);
    rooms[user.currentRoom].forEach((item) => {
      if (item.name !== user.name) {
        item.connection.send(command('message', text, user.name))
      }
    })
    } else {
      user.connection.send(command(
        'message',
        'no rooms',
        'server'
      ))
    }
  },
  connectToUser: function (toUser, user) {
    if (user.currentRoom) {
      if (user.name === rooms[user.currentRoom][0].name){
        if (users[toUser]) {
          rooms[user.currentRoom].push(users[toUser]);
          users[toUser].currentRoom = user.currentRoom
        } else {
          user.connection.send(command(
            'message',
            'no requested user',
            'server'
          ))
        }
      } else {
        user.connection.send(command(
          'message',
          `you're not owner of this channel: ${user.currentRoom}`,
          'server'
        ))
      }
    } else {
      user.connection.send(command(
        'message',
        'you\'re have no current room, create room please',
        'server'
      ))
    }
  },
  createRoom: function (roomName, user) {
    if (!rooms[roomName]){
      rooms[roomName] = [user];
      users[user.name].rooms.push(roomName);
      user.currentRoom = roomName;
      console.log(`${user.name} create room '${roomName}'`);
      user.connection.send(command(
        'message',
        `created room: ${roomName}`,
        'server'
      ))
    } else {
      user.connection.send(command(
        'message',
        `already exist room: ${roomName}`,
        'server'
      ))
    }
  },
  changeRoom: function (roomName, user) {
    user.currentRoom = roomName
  }
};

wss.on('connection', function(ws) {
  const user = { name: '', connection: ws, currentRoom: null };
  ws.on('message', message => {
    const decodedMessage = JSON.parse(message);
    commands[decodedMessage.commandName](decodedMessage.commandValue, user)
  });
  ws.send(command(
    'message',
    'connected',
    'server'
  ));
  setTimeout(chat.bind(null, ws), 1000)
});

const chat = (ws) => {
  rl.prompt();
  rl.on('line', message => {
    ws.send(command(
        'message',
        message,
        'server'));
    rl.prompt()
  })
};

