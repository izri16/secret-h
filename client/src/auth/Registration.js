import React from 'react'
import {TextField, Grid, Button} from '@material-ui/core'
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
    passwordCheck: '',
    pin: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    /*if (formData.password !== formData.passwordCheck) {
      alert('Passwords do not match')
      return
    }*/

    try {
      const res = await apiRequest('player', 'POST', {
        login: formData.login,
        password: formData.password,
        pin: formData.pin,
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

export const Registration = () => {
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
        {/*<TextField
          label="Repeat password"
          type="password"
          name="passwordCheck"
          variant="outlined"
          value={formData.passwordCheck}
          onChange={onChange('passwordCheck')}
          className={styles.input}
          required
        />*/}
        <TextField
          label="Secret pin"
          type="text"
          name="pin"
          variant="outlined"
          value={formData.pin}
          onChange={onChange('pin')}
          className={styles.input}
          required
        />
        <Button type="submit">Register</Button>
      </Grid>
    </form>
  )
}
