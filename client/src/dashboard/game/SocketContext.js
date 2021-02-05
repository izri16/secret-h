import React from 'react'
import io from 'socket.io-client'

import {useGameData} from './GameDataContext'
import {config} from '../../config'
import {useErrorHandling} from '../../ErrorHandler'

const SocketContext = React.createContext({
  socket: null,
})

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = React.useState(null)
  const {gameId, setGameData} = useGameData()
  const {setError} = useErrorHandling()

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
      if (config.dev) {
        console.error('Unexpected socket error', error)
      }
      setError(true)
    })

    setSocket(socket)
  }, [gameId, setGameData, setError])

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => React.useContext(SocketContext)
