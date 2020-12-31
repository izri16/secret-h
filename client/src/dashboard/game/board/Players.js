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
    player: ({selectable, loggedInPlayer, color}) => {
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

const isSelectable = (
  gameInfo,
  playersInfo,
  loggedInPlayerId,
  playerId,
  allSelectable
) => {
  const alivePlayersCount = Object.values(playersInfo).filter((p) => !p.killed)
    .length

  const {action} = gameInfo.conf

  if (
    loggedInPlayerId === playerId ||
    loggedInPlayerId !== gameInfo.conf.president ||
    playersInfo[playerId].killed
  ) {
    return false
  }

  if (
    action === 'choose-chancellor' &&
    (gameInfo.conf.prevChancellor !== playerId || allSelectable) &&
    (alivePlayersCount <= 5 ||
      allSelectable ||
      gameInfo.conf.prevPresident !== playerId)
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

const getConfirmConf = (socket, action, id, login) => {
  if (action === 'choose-chancellor') {
    return {
      message: (
        <Typography>
          Select <span style={{fontWeight: 'bold'}}>{login}</span> as the next{' '}
          <span style={{fontWeight: 'bold'}}>chancellor</span>?
        </Typography>
      ),
      onConfirm: () => socket.emit('choose-chancellor', {id}),
    }
  }
  if (action === 'kill') {
    return {
      message: (
        <Typography>
          Kill <span style={{fontWeight: 'bold'}}>{login}</span>?
        </Typography>
      ),
      onConfirm: () => socket.emit('kill', {id}),
    }
  }
  if (action === 'choose-president') {
    return {
      message: (
        <Typography>
          Select <span style={{fontWeight: 'bold'}}>{login}</span> as the next{' '}
          <span style={{fontWeight: 'bold'}}>president</span>?
        </Typography>
      ),
      onConfirm: () => socket.emit('choose-president', {id}),
    }
  }
  if (action === 'investigate') {
    return {
      message: (
        <Typography>
          Investigate <span style={{fontWeight: 'bold'}}>{login}</span>?
        </Typography>
      ),
      onConfirm: () => socket.emit('investigate', {id}),
    }
  }
  return null
}

const Player = ({id, order, login, race, loggedInPlayerId, allSelectable}) => {
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
  const killed = playersInfo[id].killed
  const killedStyles = {opacity: killed ? 0.4 : 1}

  const selectable = isSelectable(
    gameInfo,
    playersInfo,
    loggedInPlayerId,
    id,
    allSelectable
  )

  const styles = useStyles({
    color,
    selectable,
    loggedInPlayer: loggedInPlayerId === id,
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
      <Typography
        variant="caption"
        style={{color, ...killedStyles}}
        align="center"
      >
        {order}
      </Typography>
      <Typography
        onClick={
          selectable
            ? () => {
                const {message, onConfirm} = getConfirmConf(
                  socket,
                  gameInfo.conf.action,
                  id,
                  login
                )
                openModal(message, onConfirm)
              }
            : undefined
        }
        className={styles.player}
        style={{
          border: killed
            ? '3px solid black'
            : isPresident || isChancellor
            ? `3px solid ${theme.palette.selected.main}`
            : '1px solid #777',
          ...killedStyles,
        }}
      >
        {login}
      </Typography>
      <Typography
        variant="caption"
        style={{color, ...killedStyles}}
        align="center"
      >
        {raceLabel} {vote}
      </Typography>
    </Grid>
  )
}

export const Players = () => {
  const styles = useStyles()

  const {
    gameData: {playersInfo, playerId, gameInfo},
  } = useGameData()

  const loggedInPlayerId = playersInfo[playerId].id

  return (
    <Box className={styles.players}>
      {_.orderBy(Object.values(playersInfo), 'order').map((p) => {
        return (
          <Player
            allSelectable={gameInfo.conf.allSelectable}
            loggedInPlayerId={loggedInPlayerId}
            key={p.id}
            {...p}
          />
        )
      })}
    </Box>
  )
}
