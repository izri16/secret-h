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
    height: 200,
    width: 150,
  },
  spacer: {
    width: 30,
  },
}))

export const PresidentTurn = () => {
  const styles = useStyles()

  const isPresident = true

  return (
    <Backdrop open className={styles.backdrop}>
      {!isPresident ? (
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
            <Typography align="center">Discard one law!</Typography>
          </Box>
          <Box className={styles.voteWrapper}>
            <div className={styles.cardWrapper}>
              <BoardCard type="fascist" onClick={() => null} />
            </div>
            <div className={styles.spacer} />
            <div className={styles.cardWrapper}>
              <BoardCard type="fascist" onClick={() => null} />
            </div>
            <div className={styles.spacer} />
            <div className={styles.cardWrapper}>
              <BoardCard type="liberal" onClick={() => null} />
            </div>
          </Box>
        </Grid>
      )}
    </Backdrop>
  )
}
