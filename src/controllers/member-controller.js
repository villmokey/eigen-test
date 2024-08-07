import memberService from "../services/member-service.js";
import ResponseSuccess from "../utils/response-sucess.js";

const create = async (req, res, next) => {
  try {
    const query = await memberService.create(req.body);
    res.status(200).json(ResponseSuccess("Success to create member", query))
  } catch (error) {
    next(error)
  }
}

const list = async (req, res, next) => {
  try {
    const query = await memberService.list()
    res.status(200).json(ResponseSuccess("Success to list the members", query))
  } catch (error) {
    next(error)
  }
}

export default {
  create,
  list
}