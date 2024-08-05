import Joi from 'joi'

const createMemberValidation = Joi.object({
  code: Joi.string().max(20).required(),
  name: Joi.string().max(100).required(),
})

export {
  createMemberValidation
}
