import React from 'react'
import {Typography, Box, Grid} from '@material-ui/core'

import {BoardCard} from '../BoardCard'
import {useSocket} from '../../SocketContext'
import {useConfirmModal} from '../../ConfirmModalContext'
import {useGameData} from '../../GameDataContext'
import {Backdrop, useCommonStyles, WaitingMessage, Message} from '../utils'
import {config} from '../../../../config'

export const Vote = () => {
  const commonStyles = useCommonStyles()
  const {openModal} = useConfirmModal()
  const {socket} = useSocket()
  const {
    gameData: {gameInfo, playerId, playersInfo},
  } = useGameData()
  const voted = gameInfo.conf.voted.includes(playerId)
  const killed = playersInfo[playerId].killed

  if (killed) return null

  const yesMessage = (
    <Typography variant="body2">
      Vote <strong>YES</strong> for the government?
    </Typography>
  )
  const onYes = () => {
    openModal(yesMessage, () => {
      socket.emit('vote', {vote: true})
    })
  }
  const onAdminYes = () => {
    openModal(yesMessage, () => {
      socket.emit('voteAdmin', {vote: true})
    })
  }

  const noMessage = (
    <Typography variant="body2">
      Vote <strong>NO</strong> for the government?
    </Typography>
  )
  const onNo = () => {
    openModal(noMessage, () => {
      socket.emit('vote', {vote: false})
    })
  }
  const onAdminNo = () => {
    openModal(noMessage, () => {
      socket.emit('voteAdmin', {vote: false})
    })
  }

  return (
    <Backdrop>
      {voted ? (
        <WaitingMessage>Waiting for all players to vote ...</WaitingMessage>
      ) : (
        <>
          <Message>Vote for the government</Message>
          <Grid container justify="space-between">
            <Box className={commonStyles.cardWrapper}>
              <BoardCard type="voteNo" onClick={onNo} />
            </Box>
            <Box className={commonStyles.cardWrapper}>
              <BoardCard type="voteYes" onClick={onYes} />
            </Box>
            {config.dev && (
              <>
                <Box className={commonStyles.cardWrapper}>
                  <BoardCard type="voteAdminNo" onClick={onAdminNo} />
                </Box>
                <Box className={commonStyles.cardWrapper}>
                  <BoardCard type="voteAdminYes" onClick={onAdminYes} />
                </Box>
              </>
            )}
          </Grid>
        </>
      )}
    </Backdrop>
  )
}
