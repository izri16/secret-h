import '../mock.js'
import {killTransformer} from '../../sockets/cardActions/kill.js'
import {nameToId} from '../common.js'
import {mockedGameCore} from './common.js'

describe('7 Players: KILL', () => {
  it('Kill player after previous choose-president action "return presidency"', () => {
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

    const updatedGame = killTransformer(game, {id: nameToId.katka})
    expect(updatedGame.conf).toEqual({
      ...game.conf,
      action: 'choose-chancellor',
      // as "returnToPrevPresident" was "true", "ivana" was prevPresident and "katka"
      // is after "ivana" in the order, "katka" should be president
      // BUT: "katka" was killed, so "marek" who is after "katka" will again be president
      president: nameToId.marek,
      chancellor: null,
      prevPresident: game.conf.president,
      prevChancellor: game.conf.chancellor,
      returnToPrevPresident: false,
    })
  })
})
