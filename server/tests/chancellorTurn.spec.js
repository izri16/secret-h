import './mock.js'
import {chancellorTurnTransformer} from '../sockets/chooseLaw/transformers.js'
import {nameToId, mockedGameCore} from './common.js'

describe('CHANCELLOR TURN', () => {
  it('First round of the game', () => {
    const game = {
      ...mockedGameCore,
      conf: {
        ...mockedGameCore.conf,
        action: 'chancellor-turn',
        president: nameToId.marek,
        chancellor: nameToId.richard,
        prevPresident: null,
        prevChancellor: null,
        drawPileCount: 14,
        discardPileCount: 1,
        liberalLawsCount: 0,
        fascistsLawsCount: 0,
        allSelectable: true, // set to true for initial round
      },
      secret_conf: {
        ...mockedGameCore.secret_conf,
        discartedLaws: ['fascist'], // president discarded "fascist" law
        chancellorLaws: ['liberal', 'fascist'],
      },
    }

    // chancellor chooses "liberal" law
    const updatedGame = chancellorTurnTransformer(game, {index: 0})

    expect(updatedGame.secret_conf).toEqual({
      ...game.secret_conf,
      discartedLaws: ['fascist', 'fascist'],
      chancellorLaws: [],
    })
    expect(updatedGame.conf).toEqual({
      ...game.conf,
      action: 'choose-chancellor',
      president: nameToId.richard,
      chancellor: null,
      prevPresident: nameToId.marek,
      prevChancellor: nameToId.richard,
      drawPileCount: 14,
      discardPileCount: 2,
      liberalLawsCount: 1,
      fascistsLawsCount: 0,
      allSelectable: false,
    })
  })

  it('Liberals win', () => {
    const game = {
      ...mockedGameCore,
      conf: {
        ...mockedGameCore.conf,
        // We do not care about other properties, default,  even incosistent values should be fine
        action: 'chancellor-turn',
        liberalLawsCount: 4,
        fascistsLawsCount: 5,
      },
      secret_conf: {
        ...mockedGameCore.secret_conf,
        // We do not care about other properties, default,  even incosistent values should be fine
        chancellorLaws: ['fascist', 'liberal'],
      },
    }

    // chancellor chooses "liberal" law
    const updatedGame = chancellorTurnTransformer(game, {index: 1})

    // For game over we check just some properties as rest does not matter
    expect(updatedGame.conf.action).toEqual('results')
    expect(updatedGame.conf.results).toEqual({
      party: 'liberal',
      reason: 'liberal-laws',
    })
    expect(updatedGame.conf.liberalLawsCount).toEqual(5)
    expect(updatedGame.conf.fascistsLawsCount).toEqual(5)
  })

  it('Fascists win', () => {
    const game = {
      ...mockedGameCore,
      conf: {
        ...mockedGameCore.conf,
        // We do not care about other properties, default,  even incosistent values should be fine
        action: 'chancellor-turn',
        liberalLawsCount: 4,
        fascistsLawsCount: 5,
      },
      secret_conf: {
        ...mockedGameCore.secret_conf,
        // We do not care about other properties, default,  even incosistent values should be fine
        chancellorLaws: ['fascist', 'liberal'],
      },
    }

    // chancellor chooses "fascist" law
    const updatedGame = chancellorTurnTransformer(game, {index: 0})

    // For game over we check just some properties as rest does not matter
    expect(updatedGame.conf.action).toEqual('results')
    expect(updatedGame.conf.results).toEqual({
      party: 'fascist',
      reason: 'fascist-laws',
    })
    expect(updatedGame.conf.liberalLawsCount).toEqual(4)
    expect(updatedGame.conf.fascistsLawsCount).toEqual(6)
  })

  it('Shuffle laws when only 2 in draw pile', () => {
    const game = {
      ...mockedGameCore,
      conf: {
        ...mockedGameCore.conf,
        action: 'chancellor-turn',
        president: nameToId.marek,
        chancellor: nameToId.richard,
        drawPileCount: 2,
        discardPileCount: 7,
        liberalLawsCount: 3,
        fascistsLawsCount: 3,
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

    const updatedGame = chancellorTurnTransformer(game, {index: 0})
    expect(updatedGame.conf.discardPileCount).toEqual(0)
    expect(updatedGame.conf.drawPileCount).toEqual(10)
    expect(updatedGame.conf.liberalLawsCount).toEqual(
      game.conf.liberalLawsCount + 1
    )
    expect(updatedGame.conf.fascistsLawsCount).toEqual(
      game.conf.fascistsLawsCount
    )
  })

  it('Shuffle laws when 0 in draw pile', () => {
    const game = {
      ...mockedGameCore,
      conf: {
        ...mockedGameCore.conf,
        action: 'chancellor-turn',
        president: nameToId.marek,
        chancellor: nameToId.richard,
        drawPileCount: 0,
        discardPileCount: 9,
        liberalLawsCount: 3,
        fascistsLawsCount: 3,
      },
      secret_conf: {
        ...mockedGameCore.secret_conf,
        remainingLaws: [],
        discartedLaws: [
          'fascist',
          'fascist',
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

    const updatedGame = chancellorTurnTransformer(game, {index: 0})
    expect(updatedGame.conf.discardPileCount).toEqual(0)
    expect(updatedGame.conf.drawPileCount).toEqual(10)
    expect(updatedGame.conf.liberalLawsCount).toEqual(
      game.conf.liberalLawsCount + 1
    )
    expect(updatedGame.conf.fascistsLawsCount).toEqual(
      game.conf.fascistsLawsCount
    )
  })
})
