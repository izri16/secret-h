import React from 'react'
import {Backdrop} from '../utils'
import {useGameData} from '../../GameDataContext'
import {WaitingMessage, Message} from '../utils'

export const KillPlayer = () => {
  const {
    gameData: {gameInfo, playerId},
  } = useGameData()
  const isPresident = gameInfo.conf.president === playerId

  return (
    <Backdrop>
      {isPresident ? (
        <Message>Select a player you wish to kill!</Message>
      ) : (
        <WaitingMessage>President is killing a player ...</WaitingMessage>
      )}
    </Backdrop>
  )
}
