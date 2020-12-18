import React from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext({
  socket: null
})

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = React.useState(null)

  // TODO: in revolt there were nasty issues with useEffect, but class component worked,
  // change if issues
  React.useEffect(() => {
    // TODO: use env
    const socket = io("ws://localhost:3001", {
      withCredentials: true
    });
    setSocket(socket)
  }, [])

  return (
    <SocketContext.Provider value={{socket}}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => React.useContext(SocketContext)
