'use strict';

const io = require('socket.io')();
const eventHandlers = require('./eventHandlers');
var duration = 60 * 50
var timer = duration, minutes, seconds;
io.on('connection', (socket) => {
  let clients = eventHandlers.addToDB(socket.id);
  const connectedClients = () => clients.length;

  socket.on('/root/new_socket_connected', (data) => {
    const { message, sender } = eventHandlers.welcomeClient(data);
    const clientCount = connectedClients();
    socket.emit('/root/welcome',  {message, sender, id: socket.id});
    io.sockets.emit('root/update_socket_count', { clientCount });
  });

  socket.on('/root/new_message', (data) => {
    let message = eventHandlers.sendMessageToClient(data, socket.id);
    if (message.hasOwnProperty('sender')) {
      socket.emit('/root/update_chat', message);
    } else {
      message.sender = 'server';
      socket.broadcast.emit('/root/update_chat', message);
    }
  });

  socket.on('disconnect', () => {
    clients = eventHandlers.onClientDisconnect(socket.id);
    const clientCount = connectedClients();
    socket.broadcast.emit('root/update_socket_count', { clientCount });
  });

  setInterval(() => {
    socket.broadcast.emit('msg', new Date());



  }, 1000);


  const  call = ()=>{

    setInterval(() => {
      socket.broadcast.emit('msg', {
        minutes,seconds
      });
  
    }, 2000);

    clearInterval();
  
  }

});


module.exports = io;