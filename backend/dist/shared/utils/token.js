"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("@config/jwt");
const signToken = (payload, expiresIn = jwt_1.jwtConfig.expiresIn) => {
    const tokenExpiresIn = expiresIn;
    return jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.secret, {
        expiresIn: tokenExpiresIn,
    });
};
exports.signToken = signToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.secret);
};
exports.verifyToken = verifyToken;
