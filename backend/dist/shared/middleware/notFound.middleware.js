"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = void 0;
const ApiError_1 = require("@shared/errors/ApiError");
const notFoundMiddleware = (_req, _res, next) => {
    next(new ApiError_1.ApiError(404, 'Route not found'));
};
exports.notFoundMiddleware = notFoundMiddleware;
