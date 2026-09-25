import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { ERRORS } from "../constants/errors.js";

const isProduction = process.env.NODE_ENV === 'production';

export const errorHandler = (err, req, res, next) => {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data,
        });
    }

    // malformed JSON body from express.json()
    if (err.type === 'entity.parse.failed') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: "Invalid JSON body",
            errors: [],
            data: null,
        });
    }

    console.error(err);

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: isProduction ? ERRORS.INTERNAL_SERVER_ERROR : (err.message || ERRORS.INTERNAL_SERVER_ERROR),
        errors: [],
        data: null,
        ...(isProduction ? {} : { stack: err.stack }),
    });
};
