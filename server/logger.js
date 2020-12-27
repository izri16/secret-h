import chalk from 'chalk'
import _ from 'lodash'

const _log = console.log

const stringifyArgs = (args) =>
  args.map((a) => (_.isObject(a) ? JSON.stringify(a, null, 2) : a)).join(', ')

export const log = {
  verbose: (...args) => _log(chalk.white('Verbose:', stringifyArgs(args))),
  info: (...args) => _log(chalk.cyan('Info:', stringifyArgs(args))),
  debug: (...args) => _log(chalk.yellowBright('Debug:', stringifyArgs(args))),
  error: (...args) => _log(chalk.red('Error:', stringifyArgs(args))),
}

export const createSocketLogger = (gameId, playerId) => {
  const l = (args) => {
    return [`{gid: ${gameId}, pid: ${playerId}} >> ${stringifyArgs(args)}`]
  }

  return {
    verbose: (...args) => _log(chalk.white('Verbose:', l(args))),
    info: (...args) => _log(chalk.cyan('Info:', l(args))),
    debug: (...args) => _log(chalk.yellowBright('Debug:', l(args))),
    error: (...args) => _log(chalk.red('Error:', l(args))),
  }
}
