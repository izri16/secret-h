import React from 'react'
import {Typography, Grid, Box} from '@material-ui/core'
import {BoardCard} from '../BoardCard'
import {useGameData} from '../../GameDataContext'
import {useSocket} from '../../SocketContext'
import {useConfirmModal} from '../../ConfirmModalContext'
import {Backdrop, useCommonStyles, WaitingMessage, Message} from '../utils'

export const ChancellorTurn = ({veto}) => {
  const commonStyles = useCommonStyles()
  const {
    gameData: {gameInfo, extras, playerId},
  } = useGameData()
  const {openModal} = useConfirmModal()
  const {socket} = useSocket()
  const isChancellor = gameInfo.conf.chancellor === playerId

  const liberalMessage = (
    <Typography variant="body2">
      Select <strong>liberal</strong> law?
    </Typography>
  )
  const onSelectLiberal = (index) => {
    openModal(liberalMessage, () => {
      socket.emit('chancellorTurn', {index})
    })
  }

  const fascistMessage = (
    <Typography variant="body2">
      Select <strong>fascist</strong> law?
    </Typography>
  )
  const onSelectFascist = (index) => {
    openModal(fascistMessage, () => {
      socket.emit('chancellorTurn', {index})
    })
  }

  const vetoMessage = <Typography variant="body2">Request veto?</Typography>
  const onVeto = (index) => {
    openModal(vetoMessage, () => {
      socket.emit('chancellorTurnVeto')
    })
  }

  return (
    <Backdrop>
      {isChancellor ? (
        <>
          <Message>Choose one law!</Message>
          <Grid
            container
            justify="space-between"
            wrap="nowrap"
            className={commonStyles.scrollableContainer}
          >
            {extras.chancellorLaws.map((law, i) => (
              <Box key={i} className={commonStyles.cardWrapper}>
                <BoardCard
                  type={law}
                  onClick={() =>
                    law === 'liberal' ? onSelectLiberal(i) : onSelectFascist(i)
                  }
                />
              </Box>
            ))}
            {veto && (
              <Box className={commonStyles.cardWrapper}>
                <BoardCard type="veto" onClick={onVeto} />
              </Box>
            )}
          </Grid>
        </>
      ) : (
        <WaitingMessage>
          Waiting for chancellor to choose law ...
        </WaitingMessage>
      )}
    </Backdrop>
  )
}
