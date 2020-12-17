import {config} from '../config'

export const apiRequest = async (path, method, data) => {
  const url = `${config.serverUrl}/api/${path}`

  const options = {
    method,
    cache: 'no-cache',
    credentials: config.dev ? 'include' : 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(url, options)

  // Just ignore all errors for start
  if (response.status >= 400) {
    throw new Error('Unsuccessfull request')
  }

  return await response.json()
}
