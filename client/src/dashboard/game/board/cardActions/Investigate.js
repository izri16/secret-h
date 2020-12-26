import React from 'react'
import {Card} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {useGameData} from '../../GameDataContext'
import {useSocket} from '../../SocketContext'
import {Backdrop, WaitingMessage, Message, ContinueButton} from '../utils'

const useStyles = makeStyles((theme) => ({
  infoWrapper: {
    padding: theme.spacing(4, 6),
    display: 'flex',
    flexDirection: 'column',
  },
  submit: {
    marginTop: theme.spacing(2),
  },
}))

export const Investigate = () => {
  const styles = useStyles()
  const {
    gameData: {gameInfo, playerId, playersInfo, extras},
  } = useGameData()
  const {socket} = useSocket()
  const isPresident = gameInfo.conf.president === playerId
  const {investigateInfo} = extras

  return (
    <Backdrop>
      {isPresident ? (
        <>
          {investigateInfo ? (
            <Card className={styles.infoWrapper}>
              <Message>
                {playersInfo[investigateInfo.id].login} is{' '}
                <strong>{investigateInfo.race}</strong>
              </Message>
              <ContinueButton
                onClick={() => socket.emit('investigate-finished')}
              />
            </Card>
          ) : (
            <Message>Select a player you wish to investigate!</Message>
          )}
        </>
      ) : (
        <WaitingMessage>
          Waiting for president to investigate a player ...
        </WaitingMessage>
      )}
    </Backdrop>
  )
}
