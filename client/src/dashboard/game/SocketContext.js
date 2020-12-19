import React from 'react'
import io from 'socket.io-client'

import {config} from '../../config'

const SocketContext = React.createContext({
  socket: null
})

export const SocketProvider = ({children, gameId}) => {
  const [socket, setSocket] = React.useState(null)

  // TODO: in revolt there were nasty issues with useEffect, but class component worked,
  // change if issues
  React.useEffect(() => {

    const query = {
      gameId
    }

    if (config.testingSessions && sessionStorage.getItem('playerId')) {
      query.playerId = sessionStorage.getItem('playerId')
    }

    const socket = io(config.socketServerUrl, {
      withCredentials: true,
      query
    })

    socket.on('joined-game', (data) => {
      console.log('joined game', data)
    })

    socket.on('other-player-joined', (data) => {
      console.log('other-player-joined', data)
    })

    socket.on('game-ready', (data) => {
      console.log('game-ready', data)
    })

    setSocket(socket)
  }, [gameId])

  return (
    <SocketContext.Provider value={{socket}}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => React.useContext(SocketContext)
