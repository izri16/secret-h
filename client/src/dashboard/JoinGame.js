import React from 'react'
import {useHistory} from 'react-router-dom'

const useFormData = () => {
  const history = useHistory()
  const [formData, setFormData] = React.useState({
    gameId: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      history.push(`game/${formData.gameId}`)
    } catch (error) {
      alert('Unxepected error ...')
    }
  }

  return {
    formData,
    onChange: (name) => (e) => setFormData({...formData, [name]: e.target.value}),
    onSubmit
  }
}

export const JoinGame = () => {
  const {formData, onChange, onSubmit} = useFormData()

  return (
    <div>
      <p>Join game</p>
      <form onSubmit={onSubmit}>
        <label>Game id</label>
        <input type="number" name="gameId" value={formData.gameId} onChange={onChange('gameId')}></input>
        <button type="submit">Join game</button>
      </form>
    </div>
  )
}
