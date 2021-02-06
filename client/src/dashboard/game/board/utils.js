import React from 'react'
import {
  Backdrop as MuiBackdrop,
  Grid,
  CircularProgress,
  Typography,
  Card,
  Button,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  wrapper: {
    minHeight: 100, // without this scrolling does strange things ...
    width: 'auto',
    overflow: 'auto',
  },
}))

export const Backdrop = ({children}) => {
  const styles = useStyles()

  return (
    <MuiBackdrop open className={styles.backdrop}>
      <Grid
        container
        direction="column"
        className={styles.wrapper}
        alignItems="center"
      >
        {children}
      </Grid>
    </MuiBackdrop>
  )
}

export const useCommonStyles = makeStyles((theme) => ({
  message: {
    marginBottom: theme.spacing(2),
  },
  cardWrapper: {
    height: 200,
    width: 150,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  continueButton: {
    marginTop: theme.spacing(2),
  },
  card: {
    padding: theme.spacing(4, 6),
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.secondary.main,
  },
  scrollableContainer: {
    width: 'auto',
  },
}))

export const WaitingMessage = ({children}) => {
  const commonStyles = useCommonStyles()
  return (
    <>
      <Typography className={commonStyles.message} align="center">
        {children}
      </Typography>
      <CircularProgress color="inherit" />
    </>
  )
}

export const Message = ({children}) => {
  const commonStyles = useCommonStyles()
  return (
    <Typography className={commonStyles.message} align="center">
      {children}
    </Typography>
  )
}

export const BackdropCard = ({children}) => {
  const commonStyles = useCommonStyles()
  return <Card className={commonStyles.card}>{children}</Card>
}

export const ContinueButton = ({onClick}) => {
  const commonStyles = useCommonStyles()
  return (
    <Grid container justify="center" className={commonStyles.continueButton}>
      <Button color="primary" onClick={onClick}>
        Continue
      </Button>
    </Grid>
  )
}
