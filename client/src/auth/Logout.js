import React from 'react'
import {apiRequest} from '../utils/api'
import {useAuth} from '../auth/AuthContext'

export const Logout = () => {
  const {logout} = useAuth()

  const onLogout = async () => {
    await apiRequest('player/logout', 'POST')
    logout()
  }

  return <button onClick={onLogout}>Logout</button>
}
