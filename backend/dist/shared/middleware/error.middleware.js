"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const env_1 = require("@config/env");
const ApiError_1 = require("@shared/errors/ApiError");
const errorMiddleware = (error, _req, res, _next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let details;
    if (error instanceof ApiError_1.ApiError) {
        statusCode = error.statusCode;
        message = error.message;
        details = error.details;
    }
    else if (error instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Validation failed';
        details = error.flatten();
    }
    else if (error instanceof Error && error.message) {
        message = error.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(details ? { details } : {}),
        ...(env_1.env.NODE_ENV === 'development' && error instanceof Error ? { stack: error.stack } : {}),
    });
};
exports.errorMiddleware = errorMiddleware;
