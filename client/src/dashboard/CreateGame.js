import React from 'react'
import {useHistory} from 'react-router-dom'
import {TextField, Button, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Formik} from 'formik'
import {CreateGameSchema} from 'common/schemas'
import {apiRequest} from '../utils/api'
import {CommonFormPropsFactory} from '../utils/forms'
import {useErrorHandling} from '../ErrorHandler'

const useStyles = makeStyles((theme) => ({
  input: {
    width: 350,
  },
}))

export const CreateGame = () => {
  const styles = useStyles()
  const history = useHistory()
  const {setError} = useErrorHandling()

  const onSubmit = async (values, setSubmitting) => {
    const {data: game} = await apiRequest('game', 'POST', {
      numberOfPlayers: values.numberOfPlayers,
    })
    setSubmitting(false)
    if (game) {
      history.push(`game/${game.id}`)
    } else {
      setError(true)
    }
  }

  return (
    <Formik
      initialValues={{numberOfPlayers: 5}}
      validationSchema={CreateGameSchema}
      onSubmit={(values, {setSubmitting}) => {
        onSubmit(values, setSubmitting)
      }}
    >
      {(formProps) => {
        const getCommonProps = CommonFormPropsFactory(formProps, {
          className: styles.input,
        })
        const {handleSubmit, isSubmitting} = formProps
        return (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container direction="column">
              <TextField
                type="number"
                label="Number of players"
                {...getCommonProps('numberOfPlayers')}
              />
              <Button disabled={isSubmitting} type="submit">
                Create game
              </Button>
            </Grid>
          </form>
        )
      }}
    </Formik>
  )
}
