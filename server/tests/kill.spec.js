import './mock.js'
import {killTransformer} from '../sockets/cardActions/kill.js'
import {mockedGameCore, nameToId} from './common.js'

describe('KILL', () => {
  it('Kill player', () => {
    const game = {
      ...mockedGameCore,
      // We do not care about other properties, default,  even incosistent values should be fine
      conf: {
        ...mockedGameCore.conf,
        action: 'kill',
        president: nameToId.marek,
      },
    }

    const updatedGame = killTransformer(game, {id: nameToId.richard})
    expect(updatedGame.players[nameToId.richard].killed).toBe(true)
    expect(updatedGame.conf.action).toBe('choose-chancellor')
  })

  it('Kill hitler', () => {
    const game = {
      ...mockedGameCore,
      // We do not care about other properties, default,  even incosistent values should be fine
      conf: {
        ...mockedGameCore.conf,
        action: 'kill',
        president: nameToId.richard,
      },
    }

    const updatedGame = killTransformer(game, {id: nameToId.marek})
    expect(updatedGame.conf.action).toBe('results')
    expect(updatedGame.conf.results).toEqual({
      party: 'liberal',
      reason: 'hitler-killed',
    })
  })
})
