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
