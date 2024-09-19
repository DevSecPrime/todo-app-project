import GenerelError from './generel.error.exception'
import { HTTP_STATTUS_CODE } from '../constants/constants'

class UnprocessibleException extends GenerelError {
  constructor(message) {
    super()
    this.message = message
    this.status = HTTP_STATTUS_CODE.UNPROCESSIBLE || 422
  }
}

export default UnprocessibleException
