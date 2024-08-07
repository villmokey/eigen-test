import dayjs from "dayjs";
import { prismaClient } from "../app/database.js";
import { borrowBookValidation, createBookValidation } from "../validations/book-validation.js"
import { validate } from "../validations/validation.js"
import { ResponseError } from "../utils/response-error.js";

const borrow = async (request) => {

  return prismaClient.$transaction(async (tx) => {
    const book = validate(borrowBookValidation, request);

    if (book.book_codes.length > 2) throw new ResponseError(400, "Member cannot borrow more than 2 books");

    const sameBook = book.book_codes.every((val, i, arr) => val === arr[0])
    if (book.book_codes.length > 1 && sameBook) throw new ResponseError(400, "Member cannot borrow the same books");
  
    const countMemberBorrowBook = await tx.transaction.aggregate({
      _count: {
        id: true,
        is_return: true
      },
      where: {
        member_code: book.member_code,
        is_return: false
      }
    })
  
    if (countMemberBorrowBook._count.id == 2 && countMemberBorrowBook._count.is_return == 2) {
      throw new ResponseError(400, "Member cannot borrow more books");
    }
  
    const memberIsPenalize = await tx.member.findUnique({
      where: {
        code: book.member_code
      },
      select: {
        is_penalize: true
      }
    })
  
    if (memberIsPenalize.is_penalize) {
      throw new ResponseError(400, "Member is being penalize");
    }
  
    const bookStocks = await tx.book.findMany({
      select: {
        code: true,
        stock: true
      }
    })
  
    for (const bookItem of book.book_codes) {
      const filterBookStock = bookStocks.filter((item) => item.code == bookItem)
      if (!filterBookStock || !filterBookStock.length) throw new ResponseError(400, "Book is not found");
      if (filterBookStock[0].stock == 0) throw new ResponseError(400, "Book is out of stock");

      await tx.$queryRaw`UPDATE books SET stock = stock - 1 WHERE code = ${bookItem}`

    }

    
  
    const mappedBody = book.book_codes.map(item => ({
      member_code: book.member_code,
      book_code: item,
      return_date: dayjs().add(7, 'days').toISOString()
    }))
  
    return await tx.transaction.createManyAndReturn({
      data: mappedBody
    })
  })

}

const returnBook = async (request) => {
  return prismaClient.$transaction(async (tx) => {
    const book = validate(borrowBookValidation, request);

    const bookExpiredDate = await tx.transaction.findMany({
      where: {
        member_code: book.member_code,
        is_return: false
      },
      select: {
        book_code: true,
        borrowed_date: true,
        return_date: true,
      }
    });

    let result = {};

    const filterExpired = bookExpiredDate.filter((item) => dayjs().isAfter(item.return_date))

    if (filterExpired.length) {
      await tx.member.update({
        where: {
          code: book.member_code
        },
        data: {
          is_penalize: true,
          penalize_until: dayjs().add(3, 'days').toISOString()
        }
      });
      result = {
        penalize_until: dayjs().add(3, 'days').toISOString()
      }
    }

    const borrowedBooks = await tx.transaction.findMany({
      where: {
        member_code: book.member_code,
        is_return: false,
      }
    });

    for (const element of borrowedBooks) {
      const filterBorrowedBooks = book.book_codes.includes(element.book_code)
      if (!filterBorrowedBooks) throw new ResponseError(400, `Book with code ${element.book_code} did not borrowed by member`);

      await tx.$queryRaw`UPDATE books SET stock = stock + 1 WHERE code = ${element.book_code}`
    }

    const trx = await tx.transaction.updateMany({
      where: {
        member_code: book.member_code,
        is_return: false,
        book_code: {
          in: book.book_codes
        }
      },
      data: {
        is_return: true
      }
    });

    result = {
      ...result,
      ...trx
    }

    return result
  });
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
  return await prismaClient.book.findMany({
    where: {
      transactions: {
        every: {
          is_return: true
        }
      }
    }
  });

}

export default {
  borrow,
  create,
  list,
  returnBook
}