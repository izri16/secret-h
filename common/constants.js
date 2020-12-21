export const race = {
  liberal: 'liberal',
  hitler: 'hitler',
  fascist: 'fascist'
}

export const raceConfigurations = {
  5: {
    hitlerKnowFascists: true,
    races: {
      [race.liberal]: 3,
      [race.fascist]: 2,
    }
  },
  6: {
    hitlerKnowFascists: true,
    races: {
      [race.liberal]: 4,
      [race.fascist]: 2,
    }
  },
  7: {
    hitlerKnowFascists: false,
    races: {
      [race.liberal]: 4,
      [race.fascist]: 3,
    }
  },
  8: {
    hitlerKnowFascists: false,
    races: {
      [race.liberal]: 5,
      [race.fascist]: 3,
    }
  },
  9: {
    hitlerKnowFascists: false,
    races: {
      [race.liberal]: 5,
      [race.fascist]: 4,
    }
  },
  10: {
    hitlerKnowFascists: false,
    races: {
      [race.liberal]: 6,
      [race.fascist]: 4,
    }
  }
}

// examine: (president examine top 3 cards)
// veto: veto power unlocked
// kill: president kills a player
// investigate: president investigate a player
// choose-president: president picks next presidential candidate

const fiveAndSix = {
  2: ['examine'],
  3: ['kill'],
  4: ['kill', 'veto'],
}

const sevenAndEight = {
  1: ['investigate'],
  2: ['choose-president'],
  3: ['kill'],
  4: ['kill', 'veto'],
}

const nineAndTen = {
  0: ['investigate'],
  1: ['investigate'],
  2: ['choose-president'],
  3: ['kill'],
  4: ['kill', 'veto'],
}

export const fascistCardsConf = () => ({
  5: fiveAndSix,
  6: fiveAndSix,
  7: sevenAndEight,
  8: sevenAndEight,
  9: nineAndTen,
  10: nineAndTen,
})
