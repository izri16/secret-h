import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography,
} from '@material-ui/core'

export const ErrorDialog = () => {
  const {error, setError} = useErrorHandling()
  const closeDialog = () => setError(null)
  return (
    <Dialog
      open={!!error}
      onClose={closeDialog}
      transitionDuration={{enter: 500, exit: 0}}
    >
      <DialogTitle>Something went wrong ...</DialogTitle>
      <DialogContent>
        <Typography>
          We are sorry, but the app is having some troubles.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const ErrorHandlingContext = React.createContext(false)
ErrorHandlingContext.displayName = 'ErrorHandlingContext'

export const ErrorHandlingProvider = ({children}) => {
  const [error, setError] = React.useState(false)
  return (
    <ErrorHandlingContext.Provider value={{error, setError}}>
      {children}
    </ErrorHandlingContext.Provider>
  )
}

export const useErrorHandling = () => React.useContext(ErrorHandlingContext)
