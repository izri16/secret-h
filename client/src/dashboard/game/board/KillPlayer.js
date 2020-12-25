import React from 'react'
import {Backdrop, Typography, Grid, CircularProgress} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

import {useGameData} from '../GameDataContext'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  wrapper: {
    width: 'auto',
  },
}))

export const KillPlayer = () => {
  const styles = useStyles()

  const {
    gameData: {gameInfo, playerId},
  } = useGameData()

  const isPresident = gameInfo.conf.president === playerId

  return (
    <Backdrop open className={styles.backdrop}>
      <Grid
        container
        direction="column"
        className={styles.wrapper}
        alignItems="center"
      >
        {isPresident ? (
          <Typography variant="h5" align="center">
            Select a player you wish to kill!
          </Typography>
        ) : (
          <>
            <Typography>President is killing a player ...</Typography>
            <CircularProgress color="inherit" />
          </>
        )}
      </Grid>
    </Backdrop>
  )
}
