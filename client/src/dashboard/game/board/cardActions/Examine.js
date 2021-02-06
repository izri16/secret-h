import React from 'react'
import {Grid, Box} from '@material-ui/core'
import {BoardCard} from '../BoardCard'
import {useGameData} from '../../GameDataContext'
import {useSocket} from '../../SocketContext'
import {
  Backdrop,
  useCommonStyles,
  WaitingMessage,
  Message,
  BackdropCard,
  ContinueButton,
} from '../utils'

export const Examine = () => {
  const commonStyles = useCommonStyles()
  const {
    gameData: {gameInfo, extras, playerId},
  } = useGameData()
  const {socket} = useSocket()
  const isPresident = gameInfo.conf.president === playerId

  return (
    <Backdrop>
      {isPresident ? (
        <BackdropCard>
          <Message>Top 3 draw pile cards (leftmost is first)</Message>
          <Grid
            container
            justify="space-between"
            wrap="nowrap"
            className={commonStyles.scrollableContainer}
          >
            {extras.topCards.map((law, i) => (
              <Box key={i} className={commonStyles.cardWrapper}>
                <BoardCard type={law} />
              </Box>
            ))}
          </Grid>
          <ContinueButton onClick={() => socket.emit('examine-finished')} />
        </BackdropCard>
      ) : (
        <WaitingMessage>
          Waiting for president to examine top 3 cards ...
        </WaitingMessage>
      )}
    </Backdrop>
  )
}
