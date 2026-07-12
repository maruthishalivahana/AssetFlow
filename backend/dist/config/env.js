"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().int().positive().default(5000),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: zod_1.z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRES_IN: zod_1.z.string().min(1).default('1d'),
    CLIENT_URL: zod_1.z.string().min(1).default('http://localhost:3000'),
    UPLOAD_DIR: zod_1.z.string().min(1).default('uploads'),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error('Invalid environment variables', parsedEnv.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
}
exports.env = parsedEnv.data;
