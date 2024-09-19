import GenerelError from './generel.error.exception'
import { HTTP_STATTUS_CODE } from '../constants/constants'

class UnauthorizedException extends GenerelError {
  constructor(message) {
    super()
    this.message = message
    this.status = HTTP_STATTUS_CODE.UNAUTHORISED || 401
  }
}

export default UnauthorizedException
