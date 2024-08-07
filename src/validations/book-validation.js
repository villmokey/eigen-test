import Joi from 'joi'

const borrowBookValidation = Joi.object({
  member_code: Joi.string().max(20).required(),
  book_codes: Joi.array().items(Joi.string().max(20).required()).required(),
})

const createBookValidation = Joi.object({
  code: Joi.string().max(20).required(),
  title: Joi.string().max(100).required(),
  author: Joi.string().max(100).required(),
  stock: Joi.number().required()
})

const returnBookValidation = Joi.object({
  member_code: Joi.string().max(20).required(),
  book_codes: Joi.array().items(Joi.string().max(20).required()),
})

export {
  borrowBookValidation,
  returnBookValidation,
  createBookValidation
}
