import {config} from '../config'

export const apiRequest = async (path, method, data) => {
  const url = `${config.serverUrl}/api/${path}`

  const options = {
    method,
    cache: 'no-cache',
    credentials: config.dev ? 'include' : 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf': 1,
    },
  }

  if (config.testingSessions && sessionStorage.getItem('playerId')) {
    options.headers['x-player-id'] = sessionStorage.getItem('playerId')
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()

    return {
      status: response.status,
      error: response.ok ? null : data,
      data: response.ok ? data : null,
    }
  } catch (error) {
    return {status: 500, error, data: null}
  }
}
