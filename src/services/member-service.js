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
  return await prismaClient.member.findMany();
}

export default {
  create,
  list
}