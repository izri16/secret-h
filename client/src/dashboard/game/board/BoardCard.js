import React from 'react'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

// import {fascistCardsConf} from './constants'

const usePlayedCardStyles = makeStyles((theme) => {
  const common = {
    padding: 10,
    borderRadius: 4,
    height: '100%',
  }

  return {
    cardOuter: {
      ...common,
      background: 'white',
    },
    cardBorder: {
      ...common,
      background: ({race}) => theme.palette[race].main,
    },
    cardContent: {
      ...common,
      background: 'white',
      display: 'flex',
      justifyContent: 'center',
    },
    cardText: {
      paddingTop: 30,
      color: ({race}) => theme.palette[race].main,
    },
  }
})

const PlayedCard = ({race}) => {
  const styles = usePlayedCardStyles({race})
  return (
    <div className={styles.cardOuter}>
      <div className={styles.cardBorder}>
        <div className={styles.cardContent}>
          <Typography variant="h5" align="center" className={styles.cardText}>
            {race === 'fascist' ? 'Fascist' : 'Liberal'}
          </Typography>
        </div>
      </div>
    </div>
  )
}

const useEmptyCardStyles = makeStyles((theme) => {
  const border = (race) => `2px dashed ${theme.palette[race].dark}`

  return {
    wrapper: {
      height: '100%',
      background: ({race, position}) => {
        if (race === 'liberal') {
          return position === 4
            ? theme.palette[race].dark
            : theme.palette[race].main
        } else {
          return position < 3
            ? theme.palette[race].main
            : theme.palette[race].dark
        }
      },
      border: ({race, position}) => {
        if (race === 'liberal') {
          return position < 4 ? border(race) : 'none'
        } else {
          return position < 3 ? border(race) : 'none'
        }
      },
    },
  }
})

const EmptyCard = ({race, position}) => {
  const styles = useEmptyCardStyles({race, position})
  return <div className={styles.wrapper} />
}

const useStyles = makeStyles(() => ({
  wrapper: {
    height: '100%',
    width: 'calc(100% / 6.5)',
  },
}))

export const BoardCard = ({race, position, played}) => {
  const styles = useStyles()

  return (
    <div className={styles.wrapper}>
      {played && <PlayedCard race={race} />}
      {!played && <EmptyCard {...{race, position}} />}
    </div>
  )
}
