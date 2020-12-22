import React from 'react'
import {Box, Grid, Typography} from '@material-ui/core'
import {makeStyles, useTheme} from '@material-ui/core/styles'

import {useGameData} from '../GameDataContext'
import {useConfirmModal} from '../ConfirmModalContext'
import {useSocket} from '../SocketContext'

const useStyles = makeStyles((theme) => {
  return {
    players: {
      display: 'flex',
    },
    player: ({selectable}) => ({
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
      transition: 'background .3s',

      '&:hover': selectable
        ? {
            background: 'yellow !important',
            cursor: 'pointer',
          }
        : {},
    }),
  }
})

const Player = ({id, order, login, race}) => {
  const theme = useTheme()
  const {openModal} = useConfirmModal()
  const {socket} = useSocket()

  const {
    gameData: {gameInfo},
  } = useGameData()

  const color = {
    fascist: theme.palette.fascist.main,
    liberal: theme.palette.liberal.main,
    hitler: theme.palette.fascist.main,
    unknown: '#ddd',
  }[race]

  const raceLabel = {
    fascist: 'Fascist',
    liberal: 'Liberal',
    hitler: 'Hitler',
    unknown: '?',
  }[race]

  const isPresident = id === gameInfo.conf.president
  const isChancellor = id === gameInfo.conf.chancellor
  const selectable = !isPresident

  const styles = useStyles({selectable})
  const confirmMessage = (
    <Typography>
      Select <span style={{fontWeight: 'bold'}}>{login}</span> as the next{' '}
      <span style={{fontWeight: 'bold'}}>chancellor</span>?
    </Typography>
  )

  return (
    <Grid container direction="column">
      <Typography variant="caption" style={{color: 'yellow'}} align="center">
        {isPresident ? 'President' : isChancellor ? 'Chancellor' : ''}&nbsp;
      </Typography>
      <Typography variant="caption" style={{color}} align="center">
        {order}
      </Typography>
      <div
        key={id}
        onClick={
          selectable
            ? () =>
                openModal(confirmMessage, () => {
                  console.log('emitting ...', socket)
                  socket.emit('chooseChancellor', {id})
                })
            : undefined
        }
        className={styles.player}
        style={{
          background: color,
          border:
            isPresident || isChancellor ? '2px solid yellow' : '2px solid #777',
        }}
      >
        {login}
      </div>
      <Typography variant="caption" style={{color}} align="center">
        {raceLabel}
      </Typography>
    </Grid>
  )
}

export const Players = () => {
  const styles = useStyles()

  const {
    gameData: {playersInfo},
  } = useGameData()

  return (
    <Box className={styles.players}>
      {playersInfo.map((p) => {
        return <Player key={p.id} {...p} />
      })}
    </Box>
  )
}
