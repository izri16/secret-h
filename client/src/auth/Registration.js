import React from 'react'
import {TextField, Grid, Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {apiRequest} from '../utils/api'
import {useAuth} from '../auth/AuthContext'
import {CommonFormPropsFactory} from '../utils/forms'

const useStyles = makeStyles((theme) => ({
  input: {
    width: 300,
    marginBottom: theme.spacing(2),
  },
}))

const RegistrationSchema = Yup.object({
  login: Yup.string().required('Login is required!'),
  pin: Yup.string().required('Secret pin is required!'),
  password: Yup.string()
    .min(8, 'Password must have at least 8 characters!')
    .max(40, 'Password can not be longer than 40 characters!')
    .required('Password is required!'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match!'
  ),
})

export const Registration = () => {
  const styles = useStyles()
  const {login} = useAuth()

  const onSubmit = async (values, setSubmitting) => {
    try {
      const res = await apiRequest('player', 'POST', {
        login: values.login,
        password: values.password,
        pin: values.pin,
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
        pin: '',
        password: '',
        passwordConfirmation: '',
      }}
      validationSchema={RegistrationSchema}
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
              <TextField
                type="password"
                label="Repeat password"
                {...getCommonProps('passwordConfirmation')}
              />
              <TextField
                type="text"
                label="Secret pin"
                {...getCommonProps('pin')}
              />
              <Button type="submit" disabled={isSubmitting}>
                Register
              </Button>
            </Grid>
          </form>
        )
      }}
    </Formik>
  )
}
