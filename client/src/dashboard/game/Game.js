import React from 'react'
import {SocketProvider} from './SocketContext'
import {GameDataProvider, useGameData} from './GameDataContext'
import {PlayingBoard} from './PlayingBoard'

const GameContent = () => {
  const {gameData} = useGameData()

  if (gameData && gameData.gameInfo.active) {
    return <PlayingBoard />
  }
  console.log('game data', gameData)
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
