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

export const Examine = () => {
  const styles = useStyles()
  const {
    gameData: {gameInfo, extras, playerId},
  } = useGameData()
  const {socket} = useSocket()

  const isPresident = gameInfo.conf.president === playerId

  return (
    <Backdrop open className={styles.backdrop}>
      {!isPresident ? (
        <Grid
          container
          direction="column"
          className={styles.wrapper}
          alignItems="center"
        >
          <Typography>
            Waiting for president to examine top 3 cards ...
          </Typography>
          <CircularProgress color="inherit" />
        </Grid>
      ) : (
        <Grid container direction="column" className={styles.wrapper}>
          <Box className={styles.voteInfo}>
            <Typography variant="h5" align="center">
              Top 3 draw pile cards (leftmost is first)
            </Typography>
            <Typography align="center">
              Click on any of the cards to continue
            </Typography>
          </Box>
          <Box className={styles.voteWrapper}>
            {extras.topCards.map((law, i) => (
              <div key={i} className={styles.cardWrapper}>
                <BoardCard
                  type={law}
                  onClick={() => {
                    socket.emit('examineFinished')
                  }}
                />
              </div>
            ))}
          </Box>
        </Grid>
      )}
    </Backdrop>
  )
}
