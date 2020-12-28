import React from 'react'
import {useHistory} from 'react-router-dom'
import {TextField, Button, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {apiRequest} from '../utils/api'

const useStyles = makeStyles((theme) => ({
  input: {
    width: 350,
  },
}))

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
    onChange: (name) => (e) =>
      setFormData({...formData, [name]: e.target.value}),
    onSubmit,
  }
}

export const CreateGame = () => {
  const styles = useStyles()
  const {formData, onChange, onSubmit} = useFormData()

  return (
    <form onSubmit={onSubmit}>
      <Grid container direction="column">
        <TextField
          label="Number of players"
          type="number"
          name="numberOfPlayers"
          variant="outlined"
          value={formData.numberOfPlayers}
          onChange={onChange('numberOfPlayers')}
          required
          className={styles.input}
        />
        <Button type="submit">Create game</Button>
      </Grid>
    </form>
  )
}
