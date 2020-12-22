import {BrowserRouter as Router, Switch} from 'react-router-dom'
import {ThemeProvider} from '@material-ui/core'

import {Registration} from './auth/Registration'
import {Login} from './auth/Login'
import {AuthProvider, AuthRoute, NoAuthRoute} from './auth/AuthContext'
import {Dashboard} from './dashboard/Dashboard'
import {Game} from './dashboard/game/Game'
import {theme} from './theme'

const AppContent = () => {
  return (
    <Router>
      <Switch>
        <NoAuthRoute exact path="/">
          <Registration />
          <Login />
        </NoAuthRoute>
        <AuthRoute exact path="/dashboard">
          <Dashboard />
        </AuthRoute>
        <AuthRoute exact path="/game/:id">
          <Game />
        </AuthRoute>
      </Switch>
    </Router>
  )
}

const App = () => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ThemeProvider>
)

export default App
