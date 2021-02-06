import {BrowserRouter as Router, Switch} from 'react-router-dom'
import {ThemeProvider, Grid, Paper, Divider, Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {Registration} from './auth/Registration'
import {Login} from './auth/Login'
import {AuthProvider, AuthRoute, NoAuthRoute} from './auth/AuthContext'
import {Dashboard} from './dashboard/Dashboard'
import {Game} from './dashboard/game/Game'
import {theme} from './theme'
import {ErrorDialog, ErrorHandlingProvider} from './ErrorHandler'

const useGlobalStyles = makeStyles((theme) => ({
  '@global': {
    'body, html': {
      minHeight: '100vh',
      minWidth: '100vw',
      background: theme.palette.primary.main,
    },
    '#root': {
      width: '100%',
      height: '100%',
    },
    '*': {
      padding: 0,
      margin: 0,
      boxSizing: 'border-box',
    },
  },
}))

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'auto',
  },
  innerWrapper: {
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      minWidth: 560,
    },
  },
  divider: {
    width: '100%',
  },
  section: {
    padding: theme.spacing(3, 2, 1, 2),
  },
}))

const AppContent = () => {
  useGlobalStyles()
  const styles = useStyles()
  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      direction="column"
      className={styles.wrapper}
    >
      <Router>
        <Switch>
          <NoAuthRoute exact path="/">
            <Paper>
              <Grid
                container
                direction="column"
                alignItems="center"
                className={styles.innerWrapper}
              >
                <Box className={styles.section}>
                  <Login />
                </Box>
                <Divider className={styles.divider} />
                <Box className={styles.section}>
                  <Registration />
                </Box>
              </Grid>
            </Paper>
          </NoAuthRoute>
          <AuthRoute exact path="/dashboard">
            <Dashboard />
          </AuthRoute>
          <AuthRoute exact path="/game/:id">
            <Game />
          </AuthRoute>
        </Switch>
      </Router>
    </Grid>
  )
}

const App = () => (
  <ThemeProvider theme={theme}>
    <ErrorHandlingProvider>
      <ErrorDialog />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorHandlingProvider>
  </ThemeProvider>
)

export default App
