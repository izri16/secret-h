import React from 'react'
import {useHistory} from 'react-router-dom'
import {TextField, Button, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {CommonFormPropsFactory} from '../utils/forms'

const useStyles = makeStyles((theme) => ({
  input: {
    width: 350,
  },
}))

const JoinGameSchema = Yup.object().shape({
  gameId: Yup.string()
    .uuid('Invalid game ID!')
    .required('Game ID is required!'),
})

export const JoinGame = () => {
  const styles = useStyles()
  const history = useHistory()

  const onSubmit = async (values, setSubmitting) => {
    setSubmitting(false)
    history.push(`game/${values.gameId}`)
  }

  return (
    <Formik
      initialValues={{gameId: ''}}
      validationSchema={JoinGameSchema}
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
                type="text"
                label="Game ID"
                {...getCommonProps('gameId')}
              />
              <Button type="submit" disabled={isSubmitting}>
                Join game
              </Button>
            </Grid>
          </form>
        )
      }}
    </Formik>
  )
}
