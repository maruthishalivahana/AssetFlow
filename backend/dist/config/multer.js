"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.multerStorage = exports.uploadDir = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const env_1 = require("./env");
exports.uploadDir = path_1.default.resolve(process.cwd(), env_1.env.UPLOAD_DIR);
if (!(0, fs_1.existsSync)(exports.uploadDir)) {
    (0, fs_1.mkdirSync)(exports.uploadDir, { recursive: true });
}
exports.multerStorage = multer_1.default.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, exports.uploadDir);
    },
    filename: (_req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage: exports.multerStorage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
