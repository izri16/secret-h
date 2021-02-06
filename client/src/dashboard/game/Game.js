import React from 'react'
import _ from 'lodash'
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Box,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {SocketProvider} from './SocketContext'
import {GameDataProvider, useGameData} from './GameDataContext'
import {ConfirmModalProvider, ConfirmModal} from './ConfirmModalContext'
import {Board} from './board/Board'
import {GameUrlToClipboard} from './GameUrlToClipboard'
import {GoBack} from './board/GameResults'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    height: '100vh',
    background: theme.palette.primary.main,
    position: 'relative',
  },
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 560,
  },
  divider: {
    width: '100%',
  },
  section: {
    padding: theme.spacing(3),
  },
  goBack: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
}))

const GameContent = () => {
  const styles = useStyles()
  const {gameData} = useGameData()

  if (!gameData) {
    return (
      <Grid
        container
        alignItems="center"
        justify="center"
        direction="column"
        className={styles.wrapper}
      >
        <Box className={styles.goBack}>
          <GoBack />
        </Box>
        <CircularProgress color="secondary" />
      </Grid>
    )
  }

  if (gameData.gameInfo.active) {
    return <Board />
  } else {
    const {gameInfo, playersInfo} = gameData
    const remainingPlayersCount =
      gameInfo.number_of_players - _.size(playersInfo)

    return (
      <Grid
        container
        alignItems="center"
        justify="center"
        direction="column"
        className={styles.wrapper}
      >
        <Box className={styles.goBack}>
          <GoBack />
        </Box>
        <Paper>
          <Grid
            container
            direction="column"
            alignItems="center"
            className={styles.innerWrapper}
          >
            <Grid item>
              <Grid container justify="center" alignItems="center">
                <Typography className={styles.section}>
                  {gameData.gameInfo.id}
                </Typography>
                <GameUrlToClipboard />
              </Grid>
            </Grid>
            <Typography
              className={styles.section}
            >{`Waiting for ${remainingPlayersCount} others ...`}</Typography>
            <Divider className={styles.divider} />
            <List className={styles.section} component="nav">
              {Object.values(playersInfo).map((p, i) => (
                <ListItem key={p.id}>
                  <ListItemText primary={`${i + 1}: ${p.login}`} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Paper>
      </Grid>
    )
  }
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
