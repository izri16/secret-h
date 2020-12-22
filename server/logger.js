const prefix = 'LOGGER:'

export const log = {
  info: (...args) => console.log(prefix, args),
  warning: (...args) => console.log(prefix, args),
}
