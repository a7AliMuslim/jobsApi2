const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  let systemError={
      name:err.name || 'internal server error',
      statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg:err.msg || err.message || 'something seems to gone wrong'
  }
  return res.status(systemError.statusCode).json({ msg:systemError.msg });
}

module.exports = errorHandlerMiddleware
