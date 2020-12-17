import React from 'react'
import {apiRequest} from '../utils/api'
import {useAuth} from '../auth/AuthContext'

const useFormData = () => {
  const {login} = useAuth()
  const [formData, setFormData] = React.useState({
    login: '',
    password: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      await apiRequest('player/login', 'POST', {
        login: formData.login,
        password: formData.password,
      })
      login()
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

export const Login = () => {
  const {formData, onChange, onSubmit} = useFormData()

  return (
    <div>
      <p>Dummy login</p>
      <form onSubmit={onSubmit}>
        <label>Login</label>
        <input type="text" name="login" value={formData.login} onChange={onChange('login')}></input>

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={onChange('password')}></input>
        
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
