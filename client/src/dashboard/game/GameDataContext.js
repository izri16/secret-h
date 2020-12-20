import React from 'react'
import {useParams} from 'react-router-dom'

const GameDataContext = React.createContext({
  gameData: null,
})

export const GameDataProvider = ({children}) => {
  const params = useParams()
  const gameId = params.id

  const [gameData, setGameData] = React.useState(null)

  return (
    <GameDataContext.Provider value={{gameData, setGameData, gameId}}>
      {children}
    </GameDataContext.Provider>
  )
}

export const useGameData = () => React.useContext(GameDataContext)
