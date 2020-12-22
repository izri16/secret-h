import chalk from 'chalk'
const _log = console.log

export const log = {
  verbose: (...args) => _log(chalk.white('Verbose:', ...args)),
  info: (...args) => _log(chalk.cyan('Info:', ...args)),
  debug: (...args) => _log(chalk.yellowBright('Debug:', ...args)),
  error: (...args) => _log(chalk.red('Error:', ...args)),
}
