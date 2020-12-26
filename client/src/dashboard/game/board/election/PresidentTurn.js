import React from 'react'
import {Typography, Grid, Box} from '@material-ui/core'

import {BoardCard} from '../BoardCard'
import {useGameData} from '../../GameDataContext'
import {useSocket} from '../../SocketContext'
import {useConfirmModal} from '../../ConfirmModalContext'
import {Backdrop, useCommonStyles, WaitingMessage, Message} from '../utils'

export const PresidentTurn = () => {
  const commonStyles = useCommonStyles()
  const {
    gameData: {gameInfo, extras, playerId},
  } = useGameData()
  const {openModal} = useConfirmModal()
  const {socket} = useSocket()
  const isPresident = gameInfo.conf.president === playerId

  const liberalMessage = (
    <Typography variant="body2">
      Discard <strong>liberal</strong> law?
    </Typography>
  )
  const onDiscardLiberal = (index) => {
    openModal(liberalMessage, () => {
      socket.emit('presidentTurn', {index})
    })
  }

  const fascistMessage = (
    <Typography variant="body2">
      Discard <strong>fascist</strong> law?
    </Typography>
  )
  const onDiscardFascist = (index) => {
    openModal(fascistMessage, () => {
      socket.emit('presidentTurn', {index})
    })
  }

  return (
    <Backdrop>
      {isPresident ? (
        <>
          <Message>Discard one law!</Message>
          <Grid container justify="space-between">
            {extras.presidentLaws.map((law, i) => (
              <Box key={i} className={commonStyles.cardWrapper}>
                <BoardCard
                  type={law}
                  onClick={() =>
                    law === 'liberal'
                      ? onDiscardLiberal(i)
                      : onDiscardFascist(i)
                  }
                />
              </Box>
            ))}
          </Grid>
        </>
      ) : (
        <WaitingMessage>
          Waiting for president to discard law ...
        </WaitingMessage>
      )}
    </Backdrop>
  )
}
