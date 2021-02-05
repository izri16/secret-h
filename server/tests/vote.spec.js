import './mock.js'
import _ from 'lodash'
import {voteTransformer} from '../sockets/vote.js'
import {mockedGameCore, nameToId} from './common.js'

describe('VOTE', () => {
  describe('Base cases', () => {
    const getGame = () => ({
      ...mockedGameCore,
      // We do not care about other properties, default, even incosistent values should be fine
      conf: {
        ...mockedGameCore.conf,
        action: 'vote',
        voted: [
          nameToId.marek,
          nameToId.andrej,
          nameToId.stano,
          nameToId.michal,
        ],
        failedElectionsCount: 1,
      },
      secret_conf: {
        ...mockedGameCore.secret_conf,
        votes: {
          [nameToId.marek]: true,
          [nameToId.andrej]: true,
          [nameToId.stano]: false,
          [nameToId.michal]: false,
        },
      },
    })
    it('Successfull vote after 1 unsucessfull vote', () => {
      const game = getGame()

      // "richard" is voting as the last from the players
      const {game: updatedGame} = voteTransformer(nameToId.richard, game, {
        vote: true,
      })
      expect(updatedGame.conf.votes).toEqual({
        ...game.secret_conf.votes,
        [nameToId.richard]: true,
      })
      expect(updatedGame.conf.voted).toEqual([])
      expect(updatedGame.secret_conf.votes).toEqual({})
      expect(updatedGame.conf.action).toEqual('president-turn')
      // failed election tracker is only reset once law is elected, due to "veto" action
      expect(updatedGame.conf.failedElectionsCount).toEqual(1)
    })

    it('First unsuccessfull vote', () => {
      const game = getGame()
      game.conf.failedElectionsCount = 0

      // "richard" is voting as the last from the players
      const {game: updatedGame} = voteTransformer(nameToId.richard, game, {
        vote: false,
      })
      expect(updatedGame.conf.votes).toEqual({
        ...game.secret_conf.votes,
        [nameToId.richard]: false,
      })
      expect(updatedGame.conf.voted).toEqual([])
      expect(updatedGame.secret_conf.votes).toEqual({})
      expect(updatedGame.conf.action).toEqual('choose-chancellor')
      expect(updatedGame.conf.failedElectionsCount).toEqual(1)
    })
  })

  describe('Third unsuccessfull vote', () => {
    const getGame = () => ({
      ...mockedGameCore,
      // We do not care about other properties, default, even incosistent values should be fine
      conf: {
        ...mockedGameCore.conf,
        action: 'vote',
        voted: [
          nameToId.marek,
          nameToId.andrej,
          nameToId.stano,
          nameToId.michal,
        ],
        president: nameToId.marek,
        failedElectionsCount: 2,
        liberalLawsCount: 3,
        fascistsLawsCount: 3,
      },
      secret_conf: {
        ...mockedGameCore.secret_conf,
        // This is meant to be overriden
        remainingLaws: [],
        // This is meant to be overriden
        discartedLaws: [],
        votes: {
          [nameToId.marek]: true,
          [nameToId.andrej]: true,
          [nameToId.stano]: false,
          [nameToId.michal]: false,
        },
      },
    })

    const voteChecks = (game, updatedGame) => {
      expect(updatedGame.conf.votes).toEqual({
        ...game.secret_conf.votes,
        [nameToId.richard]: false,
      })
      expect(updatedGame.conf.voted).toEqual([])
      expect(updatedGame.secret_conf.votes).toEqual({})
      expect(updatedGame.conf.failedElectionsCount).toEqual(0)
    }

    const shuffleChecks = (game, updatedGame) => {
      expect(updatedGame.conf.drawPileCount).toEqual(8)
      expect(updatedGame.conf.discardPileCount).toEqual(0)
    }

    const electedLiberalChecks = (game, updatedGame) => {
      expect(updatedGame.conf.action).toEqual('choose-chancellor')
      expect(updatedGame.conf.liberalLawsCount).toEqual(
        game.conf.liberalLawsCount + 1
      )
      expect(updatedGame.conf.fascistsLawsCount).toEqual(
        game.conf.fascistsLawsCount
      )
      expect(updatedGame.conf.president).toEqual(nameToId.richard) // president was moved to next player
    }

    const electedFascistChecks = (game, updatedGame) => {
      expect(updatedGame.conf.action).toEqual('kill')
      expect(updatedGame.conf.liberalLawsCount).toEqual(
        game.conf.liberalLawsCount
      )
      expect(updatedGame.conf.fascistsLawsCount).toEqual(
        game.conf.fascistsLawsCount + 1
      )
      expect(updatedGame.conf.president).toEqual(nameToId.marek) // president stays due to kill action
    }

    it('0 laws in draw pile left, shuffle & fascist', () => {
      const game = getGame()
      // there are only 'fascist' laws so that we know that 'fascist' law will be drawn after shuffle
      game.conf.drawPileCount = 0
      game.conf.discardPileCount = 9
      game.secret_conf.discartedLaws = _.range(
        0,
        game.conf.discardPileCount
      ).map(() => 'fascist')

      // "richard" is voting as the last from the players
      const {game: updatedGame} = voteTransformer(nameToId.richard, game, {
        vote: false,
      })
      voteChecks(game, updatedGame)
      shuffleChecks(game, updatedGame)
      electedFascistChecks(game, updatedGame)
    })

    it('0 laws in draw pile left, shuffle & liberal', () => {
      const game = getGame()
      // there are only 'fascist' laws so that we know that 'fascist' law will be drawn after shuffle
      game.conf.drawPileCount = 0
      game.conf.discardPileCount = 9
      game.secret_conf.discartedLaws = _.range(
        0,
        game.conf.discardPileCount
      ).map(() => 'liberal')

      // "richard" is voting as the last from the players
      const {game: updatedGame} = voteTransformer(nameToId.richard, game, {
        vote: false,
      })
      voteChecks(game, updatedGame)
      shuffleChecks(game, updatedGame)
      electedLiberalChecks(game, updatedGame)
    })

    it('2 laws in draw pile left, shuffle & liberal', () => {
      const game = getGame()
      game.conf.drawPileCount = 2
      game.conf.discardPileCount = 7
      game.secret_conf.discartedLaws = _.range(
        0,
        game.conf.discardPileCount
      ).map(() => 'fascist')

      game.secret_conf.remainingLaws = _.range(0, game.conf.drawPileCount).map(
        () => 'liberal'
      )

      // "richard" is voting as the last from the players
      const {game: updatedGame} = voteTransformer(nameToId.richard, game, {
        vote: false,
      })
      voteChecks(game, updatedGame)
      shuffleChecks(game, updatedGame)
      electedLiberalChecks(game, updatedGame)
    })

    it('3 laws in draw pile left, shuffle & fascist', () => {
      const game = getGame()
      game.conf.drawPileCount = 3
      game.conf.discardPileCount = 6
      game.secret_conf.discartedLaws = _.range(
        0,
        game.conf.discardPileCount
      ).map(() => 'liberal')

      game.secret_conf.remainingLaws = _.range(0, game.conf.drawPileCount).map(
        () => 'fascist'
      )

      // "richard" is voting as the last from the players
      const {game: updatedGame} = voteTransformer(nameToId.richard, game, {
        vote: false,
      })
      voteChecks(game, updatedGame)
      shuffleChecks(game, updatedGame)
      electedFascistChecks(game, updatedGame)
    })

    it('4 laws in draw pile left, do-not-shuffle & liberal', () => {
      const game = getGame()
      game.conf.drawPileCount = 4
      game.conf.discardPileCount = 5
      game.secret_conf.discartedLaws = _.range(
        0,
        game.conf.discardPileCount
      ).map(() => 'fascist')

      game.secret_conf.remainingLaws = _.range(0, game.conf.drawPileCount).map(
        () => 'liberal'
      )

      // "richard" is voting as the last from the players
      const {game: updatedGame} = voteTransformer(nameToId.richard, game, {
        vote: false,
      })
      voteChecks(game, updatedGame)
      expect(updatedGame.conf.drawPileCount).toEqual(3)
      expect(updatedGame.conf.discardPileCount).toEqual(5)
      electedLiberalChecks(game, updatedGame)
    })

    it('4 laws in draw pile left, do-not-shuffle & fascist', () => {
      const game = getGame()
      game.conf.drawPileCount = 4
      game.conf.discardPileCount = 5
      game.secret_conf.discartedLaws = _.range(
        0,
        game.conf.discardPileCount
      ).map(() => 'liberal')

      game.secret_conf.remainingLaws = _.range(0, game.conf.drawPileCount).map(
        () => 'fascist'
      )

      // "richard" is voting as the last from the players
      const {game: updatedGame} = voteTransformer(nameToId.richard, game, {
        vote: false,
      })
      voteChecks(game, updatedGame)
      expect(updatedGame.conf.drawPileCount).toEqual(3)
      expect(updatedGame.conf.discardPileCount).toEqual(5)
      electedFascistChecks(game, updatedGame)
    })
  })

  describe('Hitler elected chancellor', () => {
    const game = {
      ...mockedGameCore,
      // We do not care about other properties, default, even incosistent values should be fine
      conf: {
        ...mockedGameCore.conf,
        action: 'vote',
        voted: [
          nameToId.marek,
          nameToId.andrej,
          nameToId.stano,
          nameToId.michal,
        ],
        president: nameToId.richard,
        chancellor: nameToId.marek, // hitler
        failedElectionsCount: 0,
      },
      secret_conf: {
        ...mockedGameCore.secret_conf,
        votes: {
          [nameToId.marek]: true,
          [nameToId.andrej]: true,
          [nameToId.stano]: false,
          [nameToId.michal]: false,
        },
      },
    }
    it('Elected before 3rd fascist law', () => {
      game.conf.fascistsLawsCount = 2
      // "richard" is voting as the last from the players
      const {game: updatedGame} = voteTransformer(nameToId.richard, game, {
        vote: true,
      })
      expect(updatedGame.conf.action).toEqual('president-turn')
    })
    it('Elected after 3rd fascist law', () => {
      game.conf.fascistsLawsCount = 3
      // "richard" is voting as the last from the players
      const {game: updatedGame} = voteTransformer(nameToId.richard, game, {
        vote: true,
      })
      expect(updatedGame.conf.action).toBe('results')
      expect(updatedGame.conf.results).toEqual({
        party: 'fascist',
        reason: 'hitler-elected',
      })
    })
  })
})
