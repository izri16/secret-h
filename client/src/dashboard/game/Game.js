import React from 'react'
import _ from 'lodash'
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Divider,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {SocketProvider} from './SocketContext'
import {GameDataProvider, useGameData} from './GameDataContext'
import {ConfirmModalProvider, ConfirmModal} from './ConfirmModalContext'
import {Board} from './board/Board'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    minHeight: '100vh',
    background: theme.palette.primary.main,
    position: 'relative',
  },
  innerWrapper: {
    width: 600,
  },
  divider: {
    width: '100%',
  },
  section: {
    padding: theme.spacing(3),
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
        <Paper>
          <Grid
            container
            direction="column"
            alignItems="center"
            className={styles.innerWrapper}
          >
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
