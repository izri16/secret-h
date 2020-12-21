import React from 'react'

import {
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'

const ConfirmModalContext = React.createContext({
  isVisible: false,
  confirmMessage: null,
  openModal: null,
  closeModal: null,
  onConfirm: null,
})

export const ConfirmModalProvider = ({children}) => {
  const [state, setState] = React.useState({
    isVisible: false,
    confirmMessage: '',
    onConfirm: null,
  })

  const closeModal = () => {
    setState({
      isVisible: false,
      confirmMessage: '',
      onConfirm: null,
    })
  }

  const openModal = (message, onConfirm) => {
    setState({
      isVisible: true,
      confirmMessage: message,
      onConfirm: () => {
        onConfirm()
        closeModal()
      },
    })
  }

  return (
    <ConfirmModalContext.Provider
      value={{
        isVisible: state.isVisible,
        openModal,
        closeModal,
        confirmMessage: state.confirmMessage,
        onConfirm: state.onConfirm,
      }}
    >
      {children}
    </ConfirmModalContext.Provider>
  )
}

export const useConfirmModal = () => React.useContext(ConfirmModalContext)

export const ConfirmModal = () => {
  const {isVisible, closeModal, confirmMessage, onConfirm} = useConfirmModal()

  return (
    <Dialog
      open={isVisible}
      onClose={closeModal}
      transitionDuration={{enter: 500, exit: 0}}
    >
      <DialogTitle>Confirm action!</DialogTitle>
      <DialogContent>{confirmMessage}</DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
