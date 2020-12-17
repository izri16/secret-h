import React from 'react'
import {CreateGame} from './CreateGame'
import {JoinGame} from './JoinGame'
import {Logout} from '../auth/Logout'

export const Dashboard = () => {
  return (
    <>
      <Logout />
      <CreateGame />
      <JoinGame />
    </>
  )
}
