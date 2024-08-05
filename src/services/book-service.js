import dayjs from "dayjs";
import { prismaClient } from "../app/database.js";
import { borrowBookValidation, createBookValidation } from "../validations/book-validation.js"
import { validate } from "../validations/validation.js"

const borrow = async (request) => {
  const book = validate(borrowBookValidation, request);

  return await prismaClient.transaction.create({
    data: {
      ...book,
      return_date: dayjs().add(7, 'days').toISOString()
    },
    select: {
      book_code: true,
      member_code: true,
      borrowed_date: true,
      return_date: true,
      books: true,
      members: true
    }
  })

}

const create = async (request) => {
  const book = validate(createBookValidation, request);

  return await prismaClient.book.create({
    data: book,
    select: {
      code: true,
      title: true,
      author: true,
      stock: true
    }
  })

}

const list = async () => {
  return await prismaClient.book.findMany();
}

export default {
  borrow,
  create,
  list
}