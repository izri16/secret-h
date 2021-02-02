export const validateRequest = (yupSchemaConf) => (req, res, next) => {
  return Promise.all(
    Object.entries(yupSchemaConf).map(([type, schema]) => {
      return schema.validate(req[type])
    })
  )
    .then(() => {
      next()
    })
    .catch(() => {
      res.status(400)
      res.json('Invalid request')
    })
}
