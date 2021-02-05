import '../mock.js'
import {chancellorTurnTransformer} from '../../sockets/chooseLaw/transformers.js'
import {nameToId} from '../common.js'
import {mockedGameCore} from './common.js'

describe('7 Players: CHANCELLOR TURN', () => {
  it('Cause Choose-president action', () => {
    const game = {
      ...mockedGameCore,
      conf: {
        ...mockedGameCore.conf,
        action: 'chancellor-turn',
        president: nameToId.marek,
        chancellor: nameToId.richard,
        prevPresident: nameToId.ivana,
        prevChancellor: nameToId.katka,
        drawPileCount: 5,
        discardPileCount: 5,
        liberalLawsCount: 3,
        fascistsLawsCount: 2,
        allSelectable: false,
      },
      secret_conf: {
        ...mockedGameCore.secret_conf,
        remainingLaws: ['fascist', 'fascist', 'liberal', 'fascist', 'fascist'],
        discartedLaws: ['fascist', 'fascist', 'liberal', 'fascist', 'fascist'],
        presidentLaws: [],
        chancellorLaws: ['liberal', 'fascist'],
      },
    }

    // chancellor chooses "fascist" law and choose-next president action is triggered
    const updatedGame = chancellorTurnTransformer(game, {index: 1})

    expect(updatedGame.conf).toEqual({
      ...game.conf,
      action: 'choose-president',
      president: game.conf.president, // remains same, as president choose the next president
      fascistsLawsCount: game.conf.fascistsLawsCount + 1,
      discardPileCount: game.conf.drawPileCount + 1,
    })
  })

  describe('Choose law after previous Choose-president action', () => {
    const game = {
      ...mockedGameCore,
      conf: {
        ...mockedGameCore.conf,
        action: 'chancellor-turn',
        president: nameToId.marek,
        chancellor: nameToId.richard,
        prevPresident: nameToId.ivana,
        prevChancellor: nameToId.katka,
        drawPileCount: 2,
        discardPileCount: 7,
        liberalLawsCount: 3,
        fascistsLawsCount: 3,
        allSelectable: false,
        returnToPrevPresident: true, // presidency order should be reset
      },
      secret_conf: {
        ...mockedGameCore.secret_conf,
        remainingLaws: ['fascist', 'fascist'],
        discartedLaws: [
          'liberal',
          'fascist',
          'liberal',
          'fascist',
          'fascist',
          'fascist',
          'fascist',
        ],
        presidentLaws: [],
        chancellorLaws: ['liberal', 'fascist'],
      },
    }
    it('liberal law choosen & reset presidency', () => {
      const updatedGame = chancellorTurnTransformer(game, {index: 0})
      expect(updatedGame.conf).toEqual({
        ...game.conf,
        action: 'choose-chancellor',
        // as "returnToPrevPresident" was "true", "ivana" was prevPresident and "katka"
        // is after "ivana" in the order, "katka" would be president
        president: nameToId.katka,
        chancellor: null,
        prevPresident: game.conf.president,
        prevChancellor: game.conf.chancellor,
        liberalLawsCount: game.conf.liberalLawsCount + 1,
        discardPileCount: 0,
        drawPileCount: 10, // (discardPile = 7) + (drawPile = 2) + (one discarded by chancellor) => shuffle
        returnToPrevPresident: false,
      })
    })
    it('fascist law choosen & kill player & do not yet reset presidency', () => {
      const updatedGame = chancellorTurnTransformer(game, {index: 1})
      expect(updatedGame.conf).toEqual({
        ...game.conf,
        action: 'kill',
        fascistsLawsCount: game.conf.fascistsLawsCount + 1,
        discardPileCount: 0,
        drawPileCount: 10, // (discardPile = 7) + (drawPile = 2) + (one discarded by chancellor) => shuffle
        returnToPrevPresident: true,
      })
    })
  })
})
