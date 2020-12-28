import React from 'react'
import {useHistory} from 'react-router-dom'
import {TextField, Button, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  input: {
    width: 350,
  },
}))

const useFormData = () => {
  const history = useHistory()
  const [formData, setFormData] = React.useState({
    gameId: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    history.push(`game/${formData.gameId}`)
  }

  return {
    formData,
    onChange: (name) => (e) =>
      setFormData({...formData, [name]: e.target.value}),
    onSubmit,
  }
}

export const JoinGame = () => {
  const styles = useStyles()
  const {formData, onChange, onSubmit} = useFormData()

  return (
    <form onSubmit={onSubmit}>
      <Grid container direction="column">
        <TextField
          label="Game ID"
          type="text"
          name="gameId"
          variant="outlined"
          value={formData.gameId}
          onChange={onChange('gameId')}
          required
          className={styles.input}
        />
        <Button type="submit">Join game</Button>
      </Grid>
    </form>
  )
}
