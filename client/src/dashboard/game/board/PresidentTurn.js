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
import {useGameData} from '../GameDataContext'
import {useSocket} from '../SocketContext'
import {useConfirmModal} from '../ConfirmModalContext'

// TODO: share styles
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  wrapper: {
    width: 'auto',
  },
  voteWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  voteInfo: {
    marginBottom: 16,
  },
  cardWrapper: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    height: 200,
    width: 150,
  },
  spacer: {
    width: 30,
  },
}))

export const PresidentTurn = () => {
  const styles = useStyles()
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
    <Backdrop open className={styles.backdrop}>
      {!isPresident ? (
        <Grid
          container
          direction="column"
          className={styles.wrapper}
          alignItems="center"
        >
          <Typography>Waiting for president to discard law ...</Typography>
          <CircularProgress color="inherit" />
        </Grid>
      ) : (
        <Grid container direction="column" className={styles.wrapper}>
          <Box className={styles.voteInfo}>
            <Typography align="center">Discard one law!</Typography>
          </Box>
          <Box className={styles.voteWrapper}>
            {extras.presidentLaws.map((law, i) => (
              <div key={i} className={styles.cardWrapper}>
                <BoardCard
                  type={law}
                  onClick={() =>
                    law === 'liberal'
                      ? onDiscardLiberal(i)
                      : onDiscardFascist(i)
                  }
                />
              </div>
            ))}
          </Box>
        </Grid>
      )}
    </Backdrop>
  )
}
