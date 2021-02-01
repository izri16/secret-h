import React from 'react'
import {TextField, Button, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {apiRequest} from '../utils/api'
import {CommonFormPropsFactory} from '../utils/forms'
import {useAuth} from '../auth/AuthContext'

const useStyles = makeStyles((theme) => ({
  input: {
    width: 300,
    marginBottom: theme.spacing(2),
  },
}))

const LoginSchema = Yup.object({
  login: Yup.string().required('Login is required!'),
  password: Yup.string().required('Password is required!'),
})

export const Login = () => {
  const styles = useStyles()
  const {login} = useAuth()

  const onSubmit = async (values, setSubmitting) => {
    try {
      const res = await apiRequest('player/login', 'POST', {
        login: values.login,
        password: values.password,
      })
      setSubmitting(false)
      login(res.playerId)
    } catch (error) {
      setSubmitting(false)
      alert('Unxepected error ...')
    }
  }

  return (
    <Formik
      initialValues={{
        login: '',
        password: '',
      }}
      validationSchema={LoginSchema}
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
                label="Login"
                {...getCommonProps('login')}
              />
              <TextField
                type="password"
                label="Password"
                {...getCommonProps('password')}
              />
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
