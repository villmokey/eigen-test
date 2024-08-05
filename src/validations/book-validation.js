import Joi from 'joi'

const borrowBookValidation = Joi.object({
  book_code: Joi.string().max(20).required(),
  member_code: Joi.string().max(20).required()
})

const createBookValidation = Joi.object({
  code: Joi.string().max(20).required(),
  title: Joi.string().max(100).required(),
  author: Joi.string().max(100).required(),
  stock: Joi.number().required()
})

const returnBookValidation = Joi.object({
  book_code: Joi.string().max(20).required(),
  member_code: Joi.string().max(20).required()
})

export {
  borrowBookValidation,
  returnBookValidation,
  createBookValidation
}
