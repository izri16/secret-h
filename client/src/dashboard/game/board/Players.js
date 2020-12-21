import React from 'react'
import {Box, Grid, Typography} from '@material-ui/core'
import {makeStyles, useTheme} from '@material-ui/core/styles'

import {useGameData} from '../GameDataContext'

const useStyles = makeStyles((theme) => {
  return {
    players: {
      display: 'flex',
    },
    player: {
      width: '70px',
      height: '70px',
      borderRadius: '35px',
      background: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginRight: theme.spacing(0.5),
      marginLeft: theme.spacing(0.5),
      overflow: 'hidden',
      fontSize: '14px',
      border: '2px solid #777',
    },
  }
})

export const Players = () => {
  const styles = useStyles()
  const theme = useTheme()

  const {
    gameData: {playersInfo},
  } = useGameData()

  return (
    <Box className={styles.players}>
      {playersInfo.map((p) => {
        const color = {
          fascist: theme.palette.fascist.main,
          liberal: theme.palette.liberal.main,
          hitler: '#000',
          unknown: '#ddd',
        }[p.race]

        return (
          <Grid container direction="column">
            <Typography variant="caption" style={{color}} align="center">
              {p.order}
            </Typography>
            <div
              key={p.order}
              className={styles.player}
              style={{background: color}}
            >
              {p.login}
            </div>
            <Typography variant="caption" style={{color}} align="center">
              {p.race}
            </Typography>
          </Grid>
        )
      })}
    </Box>
  )
}
