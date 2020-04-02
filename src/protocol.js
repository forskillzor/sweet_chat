const encode = obj => JSON.stringify(obj);
const decode = str => JSON.parse(str);

const outcome = (command, value) => encode({
  commandName: command,
  commandValue: value
});

const income = (message) => {
  const data = decode(message);
  return data;
};

export const protocol = {
  commands: {
    signin: 'signin',
    sendMessage: 'message',
    connectToUser: 'connectToUser',
    createRoom: 'createRoom',
    changeRoom: 'changeRoom'
  },
  income: function (message) {
    return decode(message)
  },
  outcome: function (command, value) {
    return decode({
      commandName: command,
      commandValue: value
    })
  },
  setConnection: function (connection) {
    this.connection = connection
  },
  signin: function (user) {
    this.user = user;
    this.connection.send(outcome(this.commands.signin, this.user))
  },
  call: function (user) {
    this.connection.send(outcome(this.commands.connectToUser, user))
  },
  chroom: function (room) {
    this.connection.send(outcome(this.commands.changeRoom, room))
  },
  sendMessage: function (text) {
    this.connection.send(outcome(this.commands.sendMessage, text))
  },
  readMessage: function (payload) {
    const message = income(payload);
    return message;
  },
  createRoom: function (roomName) {
    this.connection.send(outcome(this.commands.createRoom, roomName))
  },
};

module.exports = protocol;
