import React from 'react'
import {
  useHistory,
  useParams
} from "react-router-dom";
import {apiRequest} from '../../utils/api'
import {SocketProvider} from './SocketContext'

const GameContent = () => {
  const history = useHistory()
  const params = useParams()

  const gameId = params.id

  const onDelete = async (e) => {
    e.preventDefault()
    try {
      await apiRequest(`game/${gameId}`, 'DELETE')
      history.push('/dashboard')
    } catch (error) {
      alert('Unxepected error ...')
    }
  }

  return (
    <div>
      <p>Waiting for others ...</p>
      <form onSubmit={onDelete}>
        <button type="submit">Delete game</button>
      </form>
    </div>
  )
}

export const Game = () => (
  <SocketProvider>
    <GameContent />
  </SocketProvider>
)
