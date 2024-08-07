import { prismaClient } from "../app/database.js";
import { createMemberValidation } from "../validations/member-validation.js";
import { validate } from "../validations/validation.js"

const create = async (request) => {
  const member = validate(createMemberValidation, request);

  return await prismaClient.member.create({
    data: member,
    select: {
      code: true,
      name: true
    }
  })

}

const list = async () => {
  const members = await prismaClient.member.findMany({
    include: {
      transactions: {
        where: {
          is_return: false
        }
      }
    }
  });

  return members.map(item => ({
    ...item,
    borrowed_book_count: item.transactions.length
  }))
}

export default {
  create,
  list
}