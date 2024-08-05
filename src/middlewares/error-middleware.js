import e from "express";
import { ResponseError } from "../utils/response-error.js";

const errorMiddleware = async (err, req, res, next) => {

  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res.status(err.status).json({
      meta: {
        success: false,
        code: err.status,
        message: err.message
      },
      data: null
    }).end();
  } else {
    res.status(500).json({
      meta: {
        success: false,
        code: 500,
        message: err.message
      },
      data: null
    }).end();
  }
}

export {
  errorMiddleware
}