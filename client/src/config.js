export const config = {
  serverUrl: process.env.REACT_APP_SERVER_URL,
  socketServerUrl: process.env.REACT_APP_SOCKET_SERVER_URL,
  dev: process.env.NODE_ENV !== 'production',
  testingSessions: process.env.REACT_APP_TESTING_SESSIONS === 'true',
}
