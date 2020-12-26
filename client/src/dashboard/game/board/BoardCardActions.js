import React from 'react'
import {Box, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Visibility, Filter3, Layers, MyLocation} from '@material-ui/icons'

const conf = {
  examine: {
    label: 'President investigates top 3 cards',
    icon: <Filter3 fontSize="large" />,
  },
  kill: {
    label: 'President must kill a player',
    icon: <MyLocation fontSize="large" />,
  },
  veto: {
    label: 'Veto power unlocked',
  },
  investigate: {
    label: 'President investigates a player',
    icon: <Visibility fontSize="large" />,
  },
  'choose-president': {
    label: 'President chooses next presidential candidate',
    icon: <Layers fontSize="large" />,
  },
  'fascists-win': {
    label: 'Fascists win',
    icon: '',
  },
  'liberals-win': {
    label: 'Liberals win',
    icon: '',
  },
}

const useStyles = makeStyles((theme) => {
  return {
    wrapper: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(5, 1, 1, 1),
    },
    label: {
      marginTop: theme.spacing(1.5),
    },
  }
})

export const BoardCardActions = ({actions}) => {
  const styles = useStyles()

  if (!actions || !actions.length) return null

  const icon = conf[actions.filter((a) => conf[a].icon)[0]].icon

  return (
    <Box className={styles.wrapper}>
      <Box className={styles.icon}>{icon}</Box>
      {actions.map((action, i) => (
        <Typography
          key={i}
          align="center"
          variant="caption"
          className={styles.label}
        >
          {conf[action].label}
        </Typography>
      ))}
    </Box>
  )
}
