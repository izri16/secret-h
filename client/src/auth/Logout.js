import React from 'react'
import {Button} from '@material-ui/core'
import {apiRequest} from '../utils/api'
import {useAuth} from '../auth/AuthContext'

export const Logout = () => {
  const {logout} = useAuth()

  const onLogout = async () => {
    await apiRequest('player/logout', 'POST')
    logout()
  }

  return (
    <Button color="secondary" onClick={onLogout}>
      Logout
    </Button>
  )
}
