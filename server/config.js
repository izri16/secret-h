import dotenv from 'dotenv'

dotenv.config()

export const config = {
  sessionSecret: process.env.SESSION_SECRET,
  dbConnection: process.env.DATABASE_URL,
  port: process.env.PORT || 3000,
  allowedDevCorsOrigin: process.env.ALLOWED_DEV_CORS_ORIGIN,
  dev: process.env.NODE_ENV !== 'production',
  pin: process.env.PIN,
  testingSessions: process.env.TESTING_SESSIONS === 'true',
  https: process.env.HTTPS === 'true',
}
