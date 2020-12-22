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
  authState: LOGIN_STATUS.unknown,
  login: null,
  logout: null,
  playerData: null,
})

export const AuthProvider = ({children}) => {
  const [authState, setAuthState] = React.useState(LOGIN_STATUS.unknown)
  const [playerData, setPlayerData] = React.useState(null)

  React.useEffect(() => {
    apiRequest('player', 'GET')
      .then((data) => {
        setPlayerData(data)
        setAuthState(LOGIN_STATUS.loggedIn)
      })
      .catch(() => {
        setAuthState(LOGIN_STATUS.loggedOut)
      })
  }, [authState])

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
    <AuthContext.Provider value={{authState, login, logout, playerData}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)

export const AuthRoute = ({children, ...rest}) => {
  const {authState, playerData} = useAuth()
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
        if (authState === LOGIN_STATUS.loggedIn && !playerData) {
          return <div>Loading ...</div>
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
