import React from 'react'
import {
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  Grid,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

import {BoardCard} from './BoardCard'
import {useSocket} from '../SocketContext'
import {useConfirmModal} from '../ConfirmModalContext'
import {useGameData} from '../GameDataContext'
import {useAuth} from '../../../auth/AuthContext'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  wrapper: {
    width: 300,
  },
  voteWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  voteInfo: {
    marginBottom: 16,
  },
  cardWrapper: {
    height: 200,
    width: 150,
  },
  spacer: {
    width: 30,
  },
}))

export const Vote = () => {
  const styles = useStyles()
  const {openModal} = useConfirmModal()
  const {socket} = useSocket()
  const {
    gameData: {gameInfo},
  } = useGameData()
  const {playerData} = useAuth()

  const voted = gameInfo.conf.voted.includes(playerData.id)

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

  return (
    <Backdrop open className={styles.backdrop}>
      {voted ? (
        <Grid
          container
          direction="column"
          className={styles.wrapper}
          alignItems="center"
        >
          <Typography>Waiting for all players to vote ...</Typography>
          <CircularProgress color="inherit" />
        </Grid>
      ) : (
        <Grid container direction="column" className={styles.wrapper}>
          <Box className={styles.voteInfo}>
            <Typography align="center">Vote for the government</Typography>
          </Box>
          <Box className={styles.voteWrapper}>
            <div className={styles.cardWrapper}>
              <BoardCard type="voteNo" onClick={onNo} />
            </div>
            <div className={styles.spacer} />
            <div className={styles.cardWrapper}>
              <BoardCard type="voteYes" onClick={onYes} />
            </div>
          </Box>
        </Grid>
      )}
    </Backdrop>
  )
}
