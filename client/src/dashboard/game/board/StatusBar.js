import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {useGameData} from '../GameDataContext'

const useStatusBarStyles = makeStyles((theme) => {
  return {
    statusBar: {
      height: '80px',
      background: theme.palette.secondary.main,
      padding: theme.spacing(1),
      display: 'flex',
      justifyContent: 'space-between',
    },
    piles: {
      display: 'flex',
      height: '100%',
    },
    pileWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
    },
    pile: {
      width: 40,
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#bbb',
    },
    electionTrackerWrapper: {
      width: 400,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
    electionTracker: {
      padding: 0,
    },
    step: {
      borderRadius: 40,
      width: 30,
      height: 30,
      background: ({active}) => (active ? 'black' : 'white'),
      color: ({active}) => (active ? 'white' : 'black'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
})

const StepComponent = ({icon, active}) => {
  const styles = useStatusBarStyles({active})
  return <Typography className={styles.step}>{icon - 1}</Typography>
}

export const StatusBar = () => {
  const styles = useStatusBarStyles()

  const {
    gameData: {gameInfo},
  } = useGameData()

  return (
    <Box className={styles.statusBar}>
      <Box className={styles.piles}>
        <Box className={styles.pileWrapper}>
          <Typography>Draw pile</Typography>
          <Paper className={styles.pile}>
            <Typography>{gameInfo.conf.drawPileCount}</Typography>
          </Paper>
        </Box>

        <Box style={{marginLeft: 16}} />

        <Box className={styles.pileWrapper}>
          <Typography>Discard pile</Typography>
          <Paper className={styles.pile}>
            <Typography>{gameInfo.conf.discardPileCount}</Typography>
          </Paper>
        </Box>
      </Box>

      <Box className={styles.electionTrackerWrapper}>
        <Typography align="center">Failed election tracker</Typography>
        <Stepper
          classes={{root: styles.electionTracker}}
          activeStep={gameInfo.conf.failedElectionsCount}
        >
          {[0, 1, 2, 3].map((label) => (
            <Step key={label} completed={false}>
              <StepLabel StepIconComponent={StepComponent}></StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  )
}
