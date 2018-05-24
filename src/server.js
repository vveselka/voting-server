import Server from 'socket.io';

export default function startServer(store) {
  const io = new Server();
  io.attach(8090, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  });
  store.subscribe(() => {
    io.emit('state', store.getState().toJS());
  });

  io.on('connection', socket => {
    socket.emit('state', store.getState().toJS());
    // socket.on("action", store.dispatch.bind(store));
    socket.on('action', action => {
      console.log('on action server', action);
      store.dispatch(action);
    });
  });
}
