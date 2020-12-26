import React from 'react'
import {
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  Card,
  Grid,
  Button,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

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
  infoWrapper: {
    padding: theme.spacing(4, 6),
    display: 'flex',
    flexDirection: 'column',
  },
  submit: {
    marginTop: theme.spacing(2),
  },
}))

export const Investigate = () => {
  const styles = useStyles()
  const {
    gameData: {gameInfo, playerId, playersInfo, extras},
  } = useGameData()
  const {socket} = useSocket()
  const isPresident = gameInfo.conf.president === playerId
  const {investigateInfo} = extras

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
            Waiting for president to investigate a player ...
          </Typography>
          <CircularProgress color="inherit" />
        </Grid>
      ) : (
        <Grid container direction="column" className={styles.wrapper}>
          <Box className={styles.voteInfo}>
            {investigateInfo ? (
              <Card className={styles.infoWrapper}>
                <Typography align="center">
                  {playersInfo[investigateInfo.id].login} is{' '}
                  <strong>{investigateInfo.race}</strong>
                </Typography>
                <Button
                  color="primary"
                  className={styles.submit}
                  onClick={() => socket.emit('investigate-finished')}
                >
                  Continue
                </Button>
              </Card>
            ) : (
              <Typography variant="h5" align="center">
                Select a player you wish to investigate!
              </Typography>
            )}
          </Box>
        </Grid>
      )}
    </Backdrop>
  )
}
