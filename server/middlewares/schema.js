import * as Yup from 'yup'

export const requestShape = (yupSchemaConf) => (req, res, next) => {
  return Promise.all(
    Object.entries(yupSchemaConf).map(([type, yupSchema]) => {
      return yupSchema.validate(req[type])
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

const ErrorSchema = Yup.object({
  reason: Yup.string(),
})
  .noUnknown(true)
  .strict()

export const responseShape = (yupSchema) => (req, res, next) => {
  const origJson = res.json

  res.json = function (data) {
    const self = this
    const json = origJson.bind(self)

    if (!yupSchema) {
      return json(data)
    }

    if (self.statusCode >= 400) {
      return ErrorSchema.validate(data)
        .then(() => json(data))
        .catch(() => {
          self.status(500)
          json('Invalid response shape')
        })
    }

    return yupSchema
      .validate(data)
      .then(() => json(data))
      .catch(() => {
        self.status(500)
        json('Invalid response shape')
      })
  }
  next()
}
