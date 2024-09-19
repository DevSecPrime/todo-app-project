import GenerelError from './generel.error.exception'
import { HTTP_STATTUS_CODE } from '../constants/constants'
class BadRequestException extends GenerelError {
  constructor(message) {
    super()
    this.message = message
    this.status = HTTP_STATTUS_CODE.BAD_REQUEST || 400
  }
}

export default BadRequestException
