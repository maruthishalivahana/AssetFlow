"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.createApp = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("@config/env");
const error_middleware_1 = require("@shared/middleware/error.middleware");
const notFound_middleware_1 = require("@shared/middleware/notFound.middleware");
const rateLimiter_1 = require("@shared/middleware/rateLimiter");
const createApp = () => {
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.env.CLIENT_URL,
        credentials: true,
    }));
    app.use((0, morgan_1.default)(env_1.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(rateLimiter_1.apiRateLimiter);
    app.get('/', (_req, res) => {
        res.json({
            success: true,
            message: 'AssetFlow Backend Running',
        });
    });
    app.get('/health', (_req, res) => {
        res.json({
            status: 'OK',
            uptime: process.uptime(),
            environment: env_1.env.NODE_ENV,
        });
    });
    app.use(notFound_middleware_1.notFoundMiddleware);
    app.use(error_middleware_1.errorMiddleware);
    return app;
};
exports.createApp = createApp;
exports.app = (0, exports.createApp)();
