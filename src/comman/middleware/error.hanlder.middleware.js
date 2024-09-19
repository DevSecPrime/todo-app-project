import GenerelError from '../exceptions/generel.error.exception'
import { HTTP_STATTUS_CODE } from '../constants/constants'

export default (err, req, res, next) => {
    
    // console.log('Error captured.', err)
    if (err instanceof GenerelError) {
        return res
            .status(err.status || HTTP_STATTUS_CODE.INTERNAL_SERVER_ERROR)
            .json({
                success: false,
                status: err.status || HTTP_STATTUS_CODE.INTERNAL_SERVER_ERROR,
                message: err.message,
            })
    }

    if (err && err.error && err.error.isJoi) {
        if (err.error.details[0]) {
            return res.status(HTTP_STATTUS_CODE.UNPROCESSIBLE).json({
                success: false,
                status: HTTP_STATTUS_CODE.UNPROCESSIBLE,
                message: err.error.details[0].message,
            })
        }
    }

    if (err && err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.statusCode,
            message: err.message,
        })
    } else {
        return res.status(HTTP_STATTUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: HTTP_STATTUS_CODE.INTERNAL_SERVER_ERROR,
            error:
                err && err.message
                    ? err.message
                    : 'Internal server error OR Something went wrong',
            message: "Something went wrong"
        })
    }
}
