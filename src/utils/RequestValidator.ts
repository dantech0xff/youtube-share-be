import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import express from 'express'
import { HTTP_CODES } from '~/constants/HTTP_CODES'

export const requestValidator = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      return next()
    }

    res.status(HTTP_CODES.BAD_REQUEST).json({ errors: errors.mapped() })
  }
}
