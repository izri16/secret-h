import React from 'react'
import {TextField, Button, Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Formik} from 'formik'
import {LoginSchema} from 'common/schemas'
import {apiRequest} from '../utils/api'
import {CommonFormPropsFactory} from '../utils/forms'
import {useAuth} from '../auth/AuthContext'

const useStyles = makeStyles((theme) => ({
  input: {
    width: 300,
    marginBottom: theme.spacing(2),
  },
}))

export const Login = () => {
  const styles = useStyles()
  const {login} = useAuth()

  const onSubmit = async (values, setSubmitting, setErrors) => {
    const {data: player} = await apiRequest('player/login', 'POST', {
      login: values.login,
      password: values.password,
    })
    if (player) {
      setSubmitting(false)
      login(player.id)
    } else {
      setSubmitting(false)
      setErrors({
        failedLogin: 'Invalid credentials!',
      })
    }
  }

  return (
    <Formik
      initialValues={{
        login: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={(values, {setSubmitting, setErrors}) => {
        onSubmit(values, setSubmitting, setErrors)
      }}
    >
      {(formProps) => {
        const getCommonProps = CommonFormPropsFactory(formProps, {
          className: styles.input,
        })
        const {handleSubmit, isSubmitting, errors} = formProps
        return (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container direction="column">
              <TextField
                type="text"
                label="Login"
                {...getCommonProps('login')}
              />
              <TextField
                type="password"
                label="Password"
                {...getCommonProps('password')}
              />
              {errors && errors.failedLogin && (
                <Typography variant="caption" color="error">
                  {errors.failedLogin}
                </Typography>
              )}
              <Button type="submit" disabled={isSubmitting}>
                Login
              </Button>
            </Grid>
          </form>
        )
      }}
    </Formik>
  )
}
