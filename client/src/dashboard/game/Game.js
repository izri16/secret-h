import React from 'react'
import {SocketProvider} from './SocketContext'
import {GameDataProvider, useGameData} from './GameDataContext'
import {Board} from './board/Board'

const GameContent = () => {
  const {gameData} = useGameData()

  if (gameData && gameData.gameInfo.active) {
    return <Board />
  }
  return (
    <div>
      <p>Waiting for others ...</p>
    </div>
  )
}

export const Game = () => {
  return (
    <GameDataProvider>
      <SocketProvider>
        <GameContent />
      </SocketProvider>
    </GameDataProvider>
  )
}
