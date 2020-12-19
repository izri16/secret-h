import dotenv from 'dotenv'

dotenv.config()

export const config = {
  sessionSecret: process.env.SESSION_SECRET,
  dbConnection: process.env.DB_CONNECTION,
  https: process.env.HTTPS === 'true',
  port: process.env.PORT,
  allowedDevCorsOrigin: process.env.ALLOWED_DEV_CORS_ORIGIN,
  dev: process.env.NODE_ENV !== 'production',
  pin: process.env.PIN,
  testingSessions: process.env.TESTING_SESSIONS === 'true'
}
