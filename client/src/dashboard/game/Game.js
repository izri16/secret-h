import React from 'react'
import {SocketProvider} from './SocketContext'
import {GameDataProvider, useGameData} from './GameDataContext'
import {ConfirmModalProvider, ConfirmModal} from './ConfirmModalContext'
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
    <ConfirmModalProvider>
      <ConfirmModal />
      <GameDataProvider>
        <SocketProvider>
          <GameContent />
        </SocketProvider>
      </GameDataProvider>
    </ConfirmModalProvider>
  )
}
