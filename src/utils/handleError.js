const logger = require('../logger')


exports.handle_server_error = async (error, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let errorMessage = error.message !== '' ? JSON.stringify(error.message) : error.msg !== '' ? JSON.stringify(error.message) : 'Error not identified'
      logger.error(`Endpoint - ${req.originalUrl}[${req.method}]- Error : {message : ${errorMessage}, stack : ${JSON.stringify(error.stack)}}`)
      let errorObj;
      if (!error.errorType || error.errorType !== 'API.Error') {
        errorObj = {
          error: 'Internal Server Error',
          code: error.status ? parseInt(error.status) : 500,
          errorCode: "INTERNAL_SERVER_ERROR",
          message: error.message,
          Endpoint: req.originalUrl
        }
      }
      if (error.errorType && error.errorType === 'API.Error') {
        errorObj = {
          error: error.errorType,
          code: parseInt(error.ec.status),
          errorCode: error.ec.errorCode,
          message: error.msg,
          Endpoint: req.originalUrl
        }
      }
      return resolve(errorObj)
    } catch (error) {
      return reject({
        error: 'Internal Server Error',
        code: error.status ? parseInt(error.status) : 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        message: error.message,
        Endpoint: req.originalUrl
      })
    }
  })
}

exports.buildSuccess = (payload) => {
  return { status: "SUCCESS", ...payload };
}

exports.buildFailed = (payload) => {
  return { status: "FAILED", ...payload };
}

exports.USER_NOT_FOUND = {
  status: 404,
  errorCode: "USER_NOT_FOUND",
  errorMessage: "user doesn't exists.",
}

exports.USER_ALREADY_EXISTS = {
  status: 409,
  errorCode: "USER_ALREADY_EXISTS",
  errorMessage: "Phone already exists",
}

exports.PASSWORD_INCORRECT = {
  status: 401,
  errorCode: "PASSWORD_INCORRECT",
  errorMessage: "Incorrect password",
}

exports.NOT_AUTHENTICATED = {
  status: 401,
  errorCode: "NOT_AUTHENTICATED",
  errorMessage: "Unauthorized",
}

exports.EMPTY_CART = {
  status: 406,
  errorCode: "EMPTY_CART",
  errorMessage: "Cart cannot be empty",
}

exports.ITEMS_NOT_FOUND = {
  status: 404,
  errorCode: "ITEMS_NOT_FOUND",
  errorMessage: "Items not found",
}