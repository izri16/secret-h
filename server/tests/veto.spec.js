import './mock.js'
import {presidentTurnVetoTransformer} from '../sockets/chooseLaw/transformers.js'
import {nameToId, mockedGameCore} from './common.js'

describe('VETO', () => {
  const getGame = () => ({
    ...mockedGameCore,
    conf: {
      ...mockedGameCore.conf,
      action: 'president-turn-veto',
      president: nameToId.marek,
      chancellor: nameToId.richard,
      prevPresident: nameToId.michal,
      prevChancellor: nameToId.andrej,
      drawPileCount: 5,
      discardPileCount: 1,
      liberalLawsCount: 4,
      fascistsLawsCount: 5,
      allSelectable: false,
      failedElectionsCount: 0,
    },
    secret_conf: {
      ...mockedGameCore.secret_conf,
      discartedLaws: ['fascist'],
      remainingLaws: ['liberal', 'fascist', 'fascist', 'fascist', 'liberal'],
      chancellorLaws: ['fascist', 'fascist'],
    },
  })
  describe('President confirms veto', () => {
    it('Less than 2 failed elections', () => {
      const game = getGame()
      const updatedGame = presidentTurnVetoTransformer(game, {veto: true})

      expect(updatedGame.secret_conf).toEqual({
        ...game.secret_conf,
        discartedLaws: ['fascist', 'fascist', 'fascist'],
        chancellorLaws: [],
      })
      expect(updatedGame.conf).toEqual({
        ...game.conf,
        action: 'choose-chancellor',
        president: nameToId.richard,
        chancellor: null,
        prevPresident: nameToId.marek,
        prevChancellor: nameToId.richard,
        drawPileCount: 5,
        discardPileCount: 3, // both chancellor laws were discarded
        liberalLawsCount: 4,
        fascistsLawsCount: 5,
        allSelectable: false,
        failedElectionsCount: 1,
      })
    })

    it('Already 2 failed elections & final random law selected', () => {
      const game = getGame()
      game.conf.failedElectionsCount = 2

      const updatedGame = presidentTurnVetoTransformer(game, {veto: true})
      expect(updatedGame.conf.action).toEqual('results')
      expect(updatedGame.conf.results).toEqual({
        party: 'liberal',
        reason: 'liberal-laws',
      })
    })
  })

  describe('President rejects veto', () => {
    it('2 failed electios', () => {
      const game = getGame()
      game.conf.failedElectionsCount = 2

      const updatedGame = presidentTurnVetoTransformer(game, {veto: false})
      expect(updatedGame.secret_conf).toEqual({
        ...game.secret_conf,
        discartedLaws: ['fascist'],
        chancellorLaws: ['fascist', 'fascist'],
      })
      expect(updatedGame.conf).toEqual({
        ...game.conf,
        action: 'chancellor-turn',
      })
    })
  })
})
