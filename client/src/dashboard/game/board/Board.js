import React from 'react'
import {Paper, Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

import {BoardCard} from './BoardCard'
import {StatusBar} from './StatusBar'
import {Players} from './Players'

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

  return (
    <Box className={styles.room}>
      <div className={styles.boardWrapper}>
        <Paper className={styles.board}>
          <StatusBar />
          <div style={{height: 12}} />

          <ScoreBoard type="fascist">
            {Array.from(Array(6)).map((__, i) => {
              return (
                <BoardCard key={i} position={i} race="fascist" played={i < 1} />
              )
            })}
          </ScoreBoard>

          <div style={{height: 12}} />
          <ScoreBoard type="liberal">
            {Array.from(Array(5)).map((__, i) => {
              return (
                <BoardCard key={i} position={i} race="liberal" played={i < 3} />
              )
            })}
          </ScoreBoard>
        </Paper>
      </div>

      <div className={styles.playersWrapper}>
        <Players />
      </div>
    </Box>
  )
}
