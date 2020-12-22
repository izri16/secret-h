import React from 'react'
import {Typography} from '@material-ui/core'
import {makeStyles, useTheme, darken} from '@material-ui/core/styles'

const usePlayedCardStyles = makeStyles((theme) => {
  const common = {
    padding: 10,
    borderRadius: 4,
    height: '100%',
  }

  return {
    cardOuter: ({clickbable, color}) => ({
      ...common,
      background: 'white',
      height: '100%',
      '&:hover': clickbable
        ? {
            cursor: 'pointer',
            '& *': {
              color: darken(color, 0.3),
            },
            '& > div': {
              background: darken(color, 0.3),
            },
          }
        : {},
    }),
    cardBorder: {
      ...common,
      transition: 'background .5s',
      background: ({color}) => color,
    },
    cardContent: {
      ...common,
      background: 'white',
      display: 'flex',
      justifyContent: 'center',
    },
    cardText: {
      paddingTop: 30,
      transition: 'color .5s',
      color: ({color}) => color,
    },
  }
})

export const BoardCard = ({type, onClick}) => {
  const theme = useTheme()
  const color = {
    liberal: theme.palette.liberal.main,
    fascist: theme.palette.fascist.main,
    voteYes: '#888',
    voteNo: '#888',
  }[type]
  const text = {
    liberal: 'Liberal',
    fascist: 'Fascist',
    voteYes: 'Yes',
    voteNo: 'No',
  }[type]
  const styles = usePlayedCardStyles({color, clickbable: !!onClick})

  return (
    <div className={styles.cardOuter} onClick={onClick}>
      <div className={styles.cardBorder}>
        <div className={styles.cardContent}>
          <Typography variant="h5" align="center" className={styles.cardText}>
            {text}
          </Typography>
        </div>
      </div>
    </div>
  )
}
