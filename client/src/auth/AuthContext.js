import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {apiRequest} from '../utils/api'
import {config} from '../config'

const LOGIN_STATUS = {
  unknown: 'unknown',
  loggedIn: 'loggedIn',
  loggedOut: 'loggedOut',
}

const AuthContext = React.createContext({
  loginStatus: LOGIN_STATUS.unknown,
})

export const AuthProvider = ({children}) => {
  const [authState, setAuthState] = React.useState(LOGIN_STATUS.unknown)

  React.useEffect(() => {
    apiRequest('player', 'GET')
      .then((data) => {
        setAuthState(LOGIN_STATUS.loggedIn)
      })
      .catch(() => {
        setAuthState(LOGIN_STATUS.loggedOut)
      })
  })

  const login = (playerId) => {
    if (config.testingSessions) {
      sessionStorage.setItem('playerId', playerId)
    }
    setAuthState(LOGIN_STATUS.loggedIn)
  }
  const logout = () => {
    if (config.testingSessions) {
      sessionStorage.clear()
    }
    setAuthState(LOGIN_STATUS.loggedOut)
  }

  return (
    <AuthContext.Provider value={{authState, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)

export const AuthRoute = ({children, ...rest}) => {
  const {authState} = useAuth()
  return (
    <Route
      {...rest}
      render={({location}) => {
        if (authState === LOGIN_STATUS.unknown) {
          return <div>Loading ...</div>
        }
        if (authState === LOGIN_STATUS.loggedOut) {
          return <Redirect to="/" />
        }
        return children
      }}
    />
  )
}

export const NoAuthRoute = ({children, ...rest}) => {
  const {authState} = useAuth()
  return (
    <Route
      {...rest}
      render={({location}) => {
        if (authState === LOGIN_STATUS.unknown) {
          return <div>Loading ...</div>
        }
        if (authState === LOGIN_STATUS.loggedIn) {
          return <Redirect to="/dashboard" />
        }
        return children
      }}
    />
  )
}
