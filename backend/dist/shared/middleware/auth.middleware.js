"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const ApiError_1 = require("@shared/errors/ApiError");
const token_1 = require("@shared/utils/token");
const authMiddleware = (req, _res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader?.startsWith('Bearer ')) {
        next(new ApiError_1.ApiError(401, 'Unauthorized'));
        return;
    }
    const token = authorizationHeader.slice(7);
    try {
        req.user = (0, token_1.verifyToken)(token);
        next();
    }
    catch {
        next(new ApiError_1.ApiError(401, 'Invalid or expired token'));
    }
};
exports.authMiddleware = authMiddleware;
