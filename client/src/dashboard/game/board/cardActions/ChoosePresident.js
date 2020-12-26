import React from 'react'
import {useGameData} from '../../GameDataContext'
import {Backdrop, WaitingMessage, Message} from '../utils'

export const ChoosePresident = () => {
  const {
    gameData: {gameInfo, playerId},
  } = useGameData()
  const isPresident = gameInfo.conf.president === playerId

  return (
    <Backdrop>
      {isPresident ? (
        <Message>Select next president!</Message>
      ) : (
        <WaitingMessage>
          Waiting for president to choose next president ...
        </WaitingMessage>
      )}
    </Backdrop>
  )
}
