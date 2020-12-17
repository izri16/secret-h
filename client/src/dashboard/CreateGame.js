import React from 'react'
import {useHistory} from 'react-router-dom'
import {apiRequest} from '../utils/api'

const useFormData = () => {
  const history = useHistory()
  const [formData, setFormData] = React.useState({
    numberOfPlayers: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await apiRequest('game', 'POST', {
        numberOfPlayers: formData.numberOfPlayers,
      })
      history.push(`game/${res.id}`)
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

export const CreateGame = () => {
  const {formData, onChange, onSubmit} = useFormData()

  return (
    <div>
      <p>Create game</p>
      <form onSubmit={onSubmit}>
        <label>Number of players</label>
        <input type="number" name="numberOfPlayers" value={formData.numberOfPlayers} onChange={onChange('numberOfPlayers')}></input>
        <button type="submit">Create game</button>
      </form>
    </div>
  )
}
