import chalk from 'chalk'
const _log = console.log

const prefix = 'LOGGER:'

export const log = {
  info: (...args) => _log(chalk.green(prefix, args)),
  error: (...args) => _log(chalk.red(prefix, args)),
}
