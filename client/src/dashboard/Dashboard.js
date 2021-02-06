import React from 'react'
import {makeStyles} from '@material-ui/styles'
import {Grid, Divider, Box, Paper, Typography} from '@material-ui/core'
import {CreateGame} from './CreateGame'
import {JoinGame} from './JoinGame'
import {Logout} from '../auth/Logout'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    minHeight: '100vh',
    background: theme.palette.primary.main,
    position: 'relative',
  },
  innerWrapper: {
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      minWidth: 560,
    },
  },
  logout: {
    position: 'fixed',
    top: 20,
    right: 20,
  },
  divider: {
    width: '100%',
  },
  section: {
    padding: theme.spacing(3, 2, 1, 2),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
}))

export const Dashboard = () => {
  const styles = useStyles()
  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      direction="column"
      className={styles.wrapper}
    >
      <Box className={styles.logout}>
        <Logout />
      </Box>
      <Typography className={styles.header} variant="h5" color="secondary">
        Let the game begin!
      </Typography>
      <Grid item>
        <Paper>
          <Grid
            container
            direction="column"
            alignItems="center"
            className={styles.innerWrapper}
          >
            <Box className={styles.section}>
              <CreateGame />
            </Box>
            <Divider className={styles.divider} />
            <Box className={styles.section}>
              <JoinGame />
            </Box>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}
