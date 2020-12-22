import React from 'react'
import {Paper, Box, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

import {BoardCard} from './BoardCard'
import {StatusBar} from './StatusBar'
import {Players} from './Players'
import {Vote} from './Vote'
import {PresidentTurn} from './PresidentTurn'
import {CardActions} from './CardActions'

import {useGameData} from '../GameDataContext'
import {fascistCardsConf} from 'common/constants.js'

const useCardPlaceholderStyles = makeStyles((theme) => {
  const border = (race) => `2px dashed ${theme.palette[race].dark}`

  return {
    wrapper: {
      height: '100%',
      width: 'calc(100% / 6.5)',
      background: ({race, position}) => {
        if (race === 'liberal') {
          return position === 4
            ? theme.palette[race].dark
            : theme.palette[race].main
        } else {
          return position < 3
            ? theme.palette[race].main
            : theme.palette[race].dark
        }
      },
      border: ({race, position}) => {
        if (race === 'liberal') {
          return position < 4 ? border(race) : 'none'
        } else {
          return position < 3 ? border(race) : 'none'
        }
      },
    },
    endGame: {
      marginTop: 80,
    },
  }
})

const CardPlaceholder = ({race, position, children}) => {
  const styles = useCardPlaceholderStyles({race, position})
  const {
    gameData: {playersInfo},
  } = useGameData()

  if (race === 'fascist') {
    const conf = fascistCardsConf[playersInfo.length]
    let actions = conf[position] || []

    return (
      <div className={styles.wrapper}>
        {children}
        {position < 5 ? (
          <CardActions actions={actions} />
        ) : (
          <Typography variant="h6" align="center" className={styles.endGame}>
            Fascists win
          </Typography>
        )}
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      {children}
      {position === 4 && (
        <Typography variant="h6" align="center" className={styles.endGame}>
          Liberals win
        </Typography>
      )}
    </div>
  )
}

const useScoreBoardStyles = makeStyles((theme) => {
  return {
    wrapper: {
      flex: 1,
      display: 'flex',
      background: ({type}) =>
        type === 'fascist'
          ? theme.palette.fascist.dark
          : theme.palette.liberal.dark,
      padding: theme.spacing(2),
      border: ({type}) => `10px double ${theme.palette[type].main}`,
    },
    innerWrapper: {
      flex: 1,
      background: ({type}) =>
        type === 'fascist'
          ? theme.palette.fascist.main
          : theme.palette.liberal.main,
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0.5),
    },
  }
})

const ScoreBoard = ({children, type}) => {
  const styles = useScoreBoardStyles({type})
  return (
    <div className={styles.wrapper}>
      <div className={styles.innerWrapper}>{children}</div>
    </div>
  )
}

const useBoardStyles = makeStyles((theme) => {
  return {
    room: {
      background: theme.palette.primary.main,
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'column',
    },
    boardWrapper: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
    },
    board: {
      width: '1000px',
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      background: 'inherit',
    },
    playersWrapper: {
      marginBottom: 20,
    },
  }
})

export const Board = () => {
  const styles = useBoardStyles()
  const {
    gameData: {gameInfo},
  } = useGameData()

  return (
    <Box className={styles.room}>
      <div className={styles.boardWrapper}>
        <Paper className={styles.board}>
          <StatusBar />
          <div style={{height: 12}} />

          <ScoreBoard type="fascist">
            {Array.from(Array(6)).map((__, i) => {
              return (
                <CardPlaceholder key={i} position={i} race="fascist">
                  {i < 1 ? <BoardCard type="fascist" /> : null}
                </CardPlaceholder>
              )
            })}
          </ScoreBoard>

          <div style={{height: 12}} />
          <ScoreBoard type="liberal">
            {Array.from(Array(5)).map((__, i) => {
              return (
                <CardPlaceholder key={i} position={i} race="liberal">
                  {i < 2 ? <BoardCard type="liberal" /> : null}
                </CardPlaceholder>
              )
            })}
          </ScoreBoard>
        </Paper>
      </div>

      <div className={styles.playersWrapper}>
        <Players />
      </div>

      {gameInfo.conf.action === 'vote' && <Vote />}
      {gameInfo.conf.action === 'president-turn' && <PresidentTurn />}
    </Box>
  )
}
