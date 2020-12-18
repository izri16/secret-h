export const emitError = (socket) => {
  socket.emit('socket-error', '')
}
