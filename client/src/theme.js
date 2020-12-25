import {createMuiTheme} from '@material-ui/core/styles'

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#333',
    },
    secondary: {
      main: '#fff',
    },
    // extra properties
    liberal: {
      main: '#3DB6F8',
      dark: '#014B90',
    },
    fascist: {
      main: '#CF692E',
      dark: '#87290D',
    },
    selected: {
      main: '#e3c21e',
    },
  },
  typography: {
    fontFamily: ['Langar', 'cursive'].join(','),
  },
})
