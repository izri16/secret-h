import React from 'react'
import io from 'socket.io-client'

import {useGameData} from './GameDataContext'
import {config} from '../../config'

const SocketContext = React.createContext({
  socket: null,
})

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = React.useState(null)
  const {gameId, setGameData} = useGameData()

  React.useEffect(() => {
    const query = {
      gameId,
    }

    if (config.testingSessions && sessionStorage.getItem('playerId')) {
      query.playerId = sessionStorage.getItem('playerId')
    }

    const socket = io(config.serverUrl, {
      withCredentials: true,
      query,
    })

    socket.on('fetch-data', (data) => {
      socket.emit('getData')
    })

    socket.on('game-data', (data) => {
      setGameData(data)
    })

    socket.on('socket-error', (error) => {
      // TODO:
      alert('socket error', error)
    })

    setSocket(socket)
  }, [gameId, setGameData])

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => React.useContext(SocketContext)
