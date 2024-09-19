import GenerelError from './generel.error.exception'
import { HTTP_STATTUS_CODE } from '../constants/constants'

class ForbiddenException extends GenerelError {
  constructor(message) {
    super()
    this.message = message
    this.status = HTTP_STATTUS_CODE.FORBIDDEN || 403
  }
}

export default ForbiddenException;
