import React from 'react'
import {apiRequest} from '../utils/api'
import {useAuth} from '../auth/AuthContext'

const useFormData = () => {
  const {login} = useAuth()
  const [formData, setFormData] = React.useState({
    login: '',
    password: '',
    passwordCheck: '',
    pin: ''
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.passwordCheck) {
      alert('Passwords do not match')
      return
    }

    try {
      const res = await apiRequest('player', 'POST', {
        login: formData.login,
        password: formData.password,
        pin: formData.pin
      })
      login(res.playerId)
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

export const Registration = () => {
  const {formData, onChange, onSubmit} = useFormData()

  return (
    <div>
      <p>Dummy registration</p>
      <form onSubmit={onSubmit}>
        <label>Login</label>
        <input type="text" name="login" value={formData.login} onChange={onChange('login')}></input>

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={onChange('password')}></input>

        <label>Password check</label>
        <input type="password" name="passwordCheck" value={formData.passwordCheck} onChange={onChange('passwordCheck')}></input>

        <label>PIN</label>
        <input type="text" name="pin" value={formData.pin} onChange={onChange('pin')}></input>
        
        <button type="submit">Register</button>
      </form>
    </div>
  )
}
