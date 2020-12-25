import React from 'react'
import _ from 'lodash'
import {Box, Grid, Typography} from '@material-ui/core'
import {makeStyles, useTheme, lighten} from '@material-ui/core/styles'

import {useGameData} from '../GameDataContext'
import {useConfirmModal} from '../ConfirmModalContext'
import {useSocket} from '../SocketContext'

const useStyles = makeStyles((theme) => {
  return {
    players: {
      display: 'flex',
      position: 'relative',
      zIndex: '9999',
    },
    player: ({selectable, loggedInPlayer, race, color}) => {
      return {
        width: '70px',
        height: '70px',
        borderRadius: '35px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginRight: theme.spacing(0.5),
        marginLeft: theme.spacing(0.5),
        background: color,
        color: '#333',
        overflow: 'hidden',
        fontSize: '12px',
        padding: 4,
        transition: 'background .3s',
        textDecoration: loggedInPlayer ? 'underline' : 'none',

        '&:hover': selectable
          ? {
              background: theme.palette.selected.main,
              cursor: 'pointer',
            }
          : {
              background: color,
              cursor: 'initial',
            },
      }
    },
    president: {
      color: theme.palette.selected.main,
    },
  }
})

const isSelectable = (gameInfo, playersInfo, loggedInPlayerId, playerId) => {
  const alivePlayersCount = Object.values(playersInfo).filter((p) => !p.killed)
    .length

  const {action} = gameInfo.conf

  if (
    loggedInPlayerId === playerId ||
    loggedInPlayerId !== gameInfo.conf.president
  ) {
    return false
  }

  if (
    action === 'chooseChancellor' &&
    (alivePlayersCount === 5 || gameInfo.conf.prevPresident !== playerId)
  ) {
    return true
  }

  if (
    action === 'kill' ||
    action === 'investigate' ||
    action === 'choose-president'
  ) {
    return true
  }

  return false
}

const getConfirmMessage = (action, login) => {
  if (action === 'chooseChancellor') {
    return (
      <Typography>
        Select <span style={{fontWeight: 'bold'}}>{login}</span> as the next{' '}
        <span style={{fontWeight: 'bold'}}>chancellor</span>?
      </Typography>
    )
  }
  if (action === 'kill') {
    return (
      <Typography>
        Kill <span style={{fontWeight: 'bold'}}>{login}</span>?
      </Typography>
    )
  }
  if (action === 'choose-president') {
    return (
      <Typography>
        Select <span style={{fontWeight: 'bold'}}>{login}</span> as the next{' '}
        <span style={{fontWeight: 'bold'}}>president</span>?
      </Typography>
    )
  }
  if (action === 'investigate') {
    return (
      <Typography>
        Investigate <span style={{fontWeight: 'bold'}}>{login}</span>?
      </Typography>
    )
  }
  return null
}

const Player = ({id, order, login, race, loggedInPlayerData}) => {
  const theme = useTheme()
  const {openModal} = useConfirmModal()
  const {socket} = useSocket()

  const {
    gameData: {gameInfo, playersInfo},
  } = useGameData()

  const color = {
    fascist: lighten(theme.palette.fascist.main, 0.25),
    liberal: lighten(theme.palette.liberal.main, 0.25),
    hitler: lighten(theme.palette.fascist.dark, 0.25),
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

  const selectable = isSelectable(
    gameInfo,
    playersInfo,
    loggedInPlayerData.id,
    id
  )

  const styles = useStyles({
    color,
    selectable,
    loggedInPlayer: loggedInPlayerData.id === id,
    race,
  })

  const vote = Object.keys(gameInfo.conf.votes).length
    ? gameInfo.conf.votes[id]
      ? '(Yes)'
      : '(No)'
    : ''

  return (
    <Grid container direction="column">
      <Typography variant="caption" className={styles.president} align="center">
        {isPresident ? 'President' : isChancellor ? 'Chancellor' : ''}&nbsp;
      </Typography>
      <Typography variant="caption" style={{color}} align="center">
        {order}
      </Typography>
      <Typography
        key={id}
        onClick={
          selectable
            ? () => {
                const confirmMessage = getConfirmMessage(
                  gameInfo.conf.action,
                  login
                )
                openModal(confirmMessage, () => {
                  socket.emit('chooseChancellor', {id})
                })
              }
            : undefined
        }
        className={styles.player}
        style={{
          border:
            isPresident || isChancellor
              ? `3px solid ${theme.palette.selected.main}`
              : '1px solid #777',
        }}
      >
        {login}
      </Typography>
      <Typography variant="caption" style={{color}} align="center">
        {raceLabel} {vote}
      </Typography>
    </Grid>
  )
}

export const Players = () => {
  const styles = useStyles()

  const {
    gameData: {playersInfo, playerId},
  } = useGameData()

  const loggedInPlayerData = playersInfo[playerId]

  return (
    <Box className={styles.players}>
      {_.orderBy(Object.values(playersInfo), 'order').map((p) => {
        return (
          <Player loggedInPlayerData={loggedInPlayerData} key={p.id} {...p} />
        )
      })}
    </Box>
  )
}
