import React from 'react'
import {Backdrop, Card, Typography, Grid, Box} from '@material-ui/core'
import {KeyboardReturn} from '@material-ui/icons'
import {makeStyles} from '@material-ui/core/styles'
import {useHistory} from 'react-router-dom'
import {useGameData} from '../GameDataContext'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
  wrapper: ({winner}) => ({
    width: 'auto',
    background: 'white',
    color: theme.palette[winner].main,
    padding: theme.spacing(3),
  }),
}))

export const GoBack = ({color, text}) => {
  color = color || 'secondary'
  const history = useHistory()
  const onClick = () => {
    history.push('/')
  }
  return (
    <Grid
      container
      alignItems="center"
      style={{cursor: 'pointer', zIndex: 9999999, position: 'relative'}}
      onClick={onClick}
    >
      <KeyboardReturn color={color} />
      {text && <Typography color={color}>{text}</Typography>}
    </Grid>
  )
}

export const GameResults = () => {
  const {
    gameData: {gameInfo},
  } = useGameData()

  const party = gameInfo.conf.results.party
  const reason = {
    'hitler-killed': 'Hitler was killed',
    'hitler-elected': 'Hitler was elected chancellor',
    'liberal-laws': 'Liberals elected 5 laws',
    'fascist-laws': 'Fascists elected 6 laws',
  }[gameInfo.conf.results.reason]
  const title = {
    liberal: 'Liberals win!',
    fascist: 'Fascists win!',
  }[party]

  const styles = useStyles({winner: party})

  return (
    <Backdrop open className={styles.backdrop}>
      <Card>
        <Grid container direction="column" className={styles.wrapper}>
          <Typography variant="h3" align="center">
            {title}
          </Typography>
          <Typography variant="h5" align="center">
            {reason}
          </Typography>
          <Box mt={2} />
          <GoBack color="primary" text="Menu" />
        </Grid>
      </Card>
    </Backdrop>
  )
}
