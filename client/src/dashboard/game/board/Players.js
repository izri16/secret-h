import React from 'react'
import _ from 'lodash'
import {Box, Grid, Typography} from '@material-ui/core'
import {makeStyles, useTheme, lighten} from '@material-ui/core/styles'

import {useGameData} from '../GameDataContext'
import {useConfirmModal} from '../ConfirmModalContext'
import {useSocket} from '../SocketContext'

const yellow = '#e3c21e'

const useStyles = makeStyles((theme) => {
  return {
    players: {
      display: 'flex',
    },
    player: ({selectable, loggedInPlayer, race}) => {
      // TODO: share
      const color = {
        fascist: lighten(theme.palette.fascist.main, 0.25),
        liberal: lighten(theme.palette.liberal.main, 0.25),
        hitler: lighten(theme.palette.fascist.dark, 0.25),
        unknown: '#ddd',
      }[race]
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
              background: yellow,
              cursor: 'pointer',
            }
          : {
              background: color,
              cursor: 'initial',
            },
      }
    },
  }
})

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

  const alivePlayersCount = Object.values(playersInfo).filter((p) => !p.killed)
    .length

  const selectable =
    gameInfo.conf.action !== 'results' &&
    gameInfo.conf.action === 'chooseChancellor' &&
    loggedInPlayerData.id === gameInfo.conf.president &&
    !isPresident &&
    gameInfo.conf.prevChancellor !== id &&
    (alivePlayersCount === 5 || gameInfo.conf.prevPresident !== id)

  const styles = useStyles({
    selectable,
    loggedInPlayer: loggedInPlayerData.id === id,
    race,
  })
  const confirmMessage = (
    <Typography>
      Select <span style={{fontWeight: 'bold'}}>{login}</span> as the next{' '}
      <span style={{fontWeight: 'bold'}}>chancellor</span>?
    </Typography>
  )

  const vote = Object.keys(gameInfo.conf.votes).length
    ? gameInfo.conf.votes[id]
      ? '(Yes)'
      : '(No)'
    : ''

  // TODO: there can be multiple reasons for selecting player
  // TODO: based on the reason other players might be selectable

  return (
    <Grid container direction="column">
      <Typography variant="caption" style={{color: yellow}} align="center">
        {isPresident ? 'President' : isChancellor ? 'Chancellor' : ''}&nbsp;
      </Typography>
      <Typography variant="caption" style={{color}} align="center">
        {order}
      </Typography>
      <Typography
        key={id}
        onClick={
          selectable
            ? () =>
                openModal(confirmMessage, () => {
                  socket.emit('chooseChancellor', {id})
                })
            : undefined
        }
        className={styles.player}
        style={{
          border:
            isPresident || isChancellor
              ? `3px solid ${yellow}`
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
