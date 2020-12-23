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

export const ChancellorTurn = () => {
  const styles = useStyles()
  const {
    gameData: {gameInfo, extras, playerId},
  } = useGameData()
  const {openModal} = useConfirmModal()
  const {socket} = useSocket()

  const isChancellor = gameInfo.conf.chancellor === playerId

  const liberalMessage = (
    <Typography variant="body2">
      Select <strong>liberal</strong> law?
    </Typography>
  )
  const onSelectLiberal = (index) => {
    openModal(liberalMessage, () => {
      socket.emit('chancellorTurn', {index})
    })
  }

  const fascistMessage = (
    <Typography variant="body2">
      Select <strong>fascist</strong> law?
    </Typography>
  )
  const onSelectFascist = (index) => {
    openModal(fascistMessage, () => {
      socket.emit('chancellorTurn', {index})
    })
  }

  return (
    <Backdrop open className={styles.backdrop}>
      {!isChancellor ? (
        <Grid
          container
          direction="column"
          className={styles.wrapper}
          alignItems="center"
        >
          <Typography>Waiting for chancellor to choose law ...</Typography>
          <CircularProgress color="inherit" />
        </Grid>
      ) : (
        <Grid container direction="column" className={styles.wrapper}>
          <Box className={styles.voteInfo}>
            <Typography align="center">Choose one law!</Typography>
          </Box>
          <Box className={styles.voteWrapper}>
            {extras.chancellorLaws.map((law, i) => (
              <div key={i} className={styles.cardWrapper}>
                <BoardCard
                  type={law}
                  onClick={() =>
                    law === 'liberal' ? onSelectLiberal(i) : onSelectFascist(i)
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
