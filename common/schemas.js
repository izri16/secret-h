import * as Yup from 'yup'

const loginSchema = Yup.string().required('Login is required!')
const pinSchema = Yup.string().required('Secret pin is required!')
const passwordSchema = Yup.string()
  .min(8, 'Password must have at least 8 characters!')
  .max(40, 'Password can not be longer than 40 characters!')
  .required('Password is required!')

export const CommonRegistrationSchema = {
  login: loginSchema,
  pin: pinSchema,
  password: passwordSchema
}

export const LoginSchema = Yup.object({
  login: Yup.string().required('Login is required!'),
  password: Yup.string().required('Password is required!'),
})

export const CreateGameSchema = Yup.object().shape({
  numberOfPlayers: Yup.number()
    .min(5, 'Min number of players is 5!')
    .max(10, 'Max number of players is 10!')
    .required('Number of players is required!'),
})
