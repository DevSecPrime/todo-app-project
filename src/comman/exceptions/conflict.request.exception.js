import GenerelError from './generel.error.exception'
import { HTTP_STATTUS_CODE } from '../constants/constants'

class ConflictRequestException extends GenerelError {
  constructor(message) {
    super()
    this.message = message
    this.status = HTTP_STATTUS_CODE.CONFLICT || 409
  }
}

export default ConflictRequestException
