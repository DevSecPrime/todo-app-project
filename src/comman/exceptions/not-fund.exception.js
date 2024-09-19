import GenerelError from './generel.error.exception'
import { HTTP_STATTUS_CODE } from '../constants/constants'

class NotFoundException extends GenerelError {
  constructor(message) {
    super()
    this.message = message
    this.status = HTTP_STATTUS_CODE.NOT_FOUND || 404 // 404 Not Found status code by default.
  }
}

export default NotFoundException;
