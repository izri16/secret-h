import {
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import {Registration} from './auth/Registration'
import {Login} from './auth/Login'
import {Logout} from './auth/Logout'
import {AuthProvider, AuthRoute, NoAuthRoute} from './auth/AuthContext'

const AppContent = () => {
  return (
    <Router>
      <Switch>
        <NoAuthRoute exact path="/">
          <Registration />
          <Login />
        </NoAuthRoute>
        <AuthRoute exact path="/game">
          <Logout />
        </AuthRoute>
      </Switch>
    </Router>
  )
}

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
)

export default App
