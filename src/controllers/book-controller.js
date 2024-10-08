import bookService from "../services/book-service.js"
import ResponseSuccess from "../utils/response-sucess.js";

const create = async (req, res, next) => {
  try {
    const query = await bookService.create(req.body);
    res.status(200).json(ResponseSuccess("Success to create book", query))
  } catch (error) {
    next(error)
  }
}

const borrow = async (req, res, next) => {
  try {
    const query = await bookService.borrow(req.body);
    res.status(200).json(ResponseSuccess("Success to borrow book", query))
  } catch (error) {
    next(error)
  }
}

const returnBook = async (req, res, next) => {
  try {
    const query = await bookService.returnBook(req.body);
    const msg = query.penalize_until ? 'Success to return book but member got penalized' : 'Success to return book'
    res.status(200).json(ResponseSuccess(msg, query))
  } catch (error) {
    next(error)
  }
}

const list = async (req, res, next) => {
  try {
    const query = await bookService.list()
    res.status(200).json(ResponseSuccess("Success to list the books", query))
  } catch (error) {
    next(error)
  }
}

export default {
  borrow,
  create,
  list,
  returnBook
}