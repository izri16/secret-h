import React from 'react'
import {TextField, Button, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {apiRequest} from '../utils/api'
import {useAuth} from '../auth/AuthContext'

const useStyles = makeStyles((theme) => ({
  input: {
    width: 300,
    marginBottom: theme.spacing(2),
  },
}))

const useFormData = () => {
  const {login} = useAuth()
  const [formData, setFormData] = React.useState({
    login: '',
    password: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await apiRequest('player/login', 'POST', {
        login: formData.login,
        password: formData.password,
      })
      login(res.playerId)
    } catch (error) {
      alert('Unxepected error ...')
    }
  }

  return {
    formData,
    onChange: (name) => (e) =>
      setFormData({...formData, [name]: e.target.value}),
    onSubmit,
  }
}

export const Login = () => {
  const styles = useStyles()
  const {formData, onChange, onSubmit} = useFormData()

  return (
    <form onSubmit={onSubmit}>
      <Grid container direction="column">
        <TextField
          label="Login"
          type="text"
          name="login"
          variant="outlined"
          value={formData.login}
          onChange={onChange('login')}
          className={styles.input}
          required
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          variant="outlined"
          value={formData.password}
          onChange={onChange('password')}
          className={styles.input}
          required
        />
        <Button type="submit">Login</Button>
      </Grid>
    </form>
  )
}
