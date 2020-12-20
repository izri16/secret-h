export const race = {
  liberal: 'liberal',
  hitler: 'hitler',
  fascists: 'fascist'
}

export const raceConfigurations = {
  5: {
    hitlerKnowFascists: true,
    races: {
      [race.liberal]: 3,
      [race.fascists]: 2,
    }
  },
  6: {
    hitlerKnowFascists: true,
    races: {
      [race.liberal]: 4,
      [race.fascists]: 2,
    }
  },
  7: {
    hitlerKnowFascists: false,
    races: {
      [race.liberal]: 4,
      [race.fascists]: 3,
    }
  },
  8: {
    hitlerKnowFascists: false,
    races: {
      [race.liberal]: 5,
      [race.fascists]: 3,
    }
  },
  9: {
    hitlerKnowFascists: false,
    races: {
      [race.liberal]: 5,
      [race.fascists]: 4,
    }
  },
  10: {
    hitlerKnowFascists: false,
    races: {
      [race.liberal]: 6,
      [race.fascists]: 4,
    }
  }
}
