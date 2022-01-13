"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const userDao = new user_1.UserDao();
const AuthFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Extract token from headers
    const authorization_header = req.headers['authorization'];
    let token = '';
    // No authorization headers means no authenticated user, also check if the token type is a bearer token
    if (authorization_header && authorization_header.startsWith('Bearer')) {
        token = authorization_header.split(' ')[1];
        if (token != '' && token !== 'undefined') {
            try {
                const secret = process.env.JWT_SECRET;
                const token_details = jsonwebtoken_1.default.verify(token, secret);
                // If token is decoded and payload is there, attach the user to the request body
                if (token_details.username) {
                    const user = yield userDao.loadUserDetails(token_details.username);
                    if (!user)
                        return res.status(403).json({ status: 403, message: "No user associated with the access_token" });
                    req.body.authenticated =
                        { id: user.id, first_name: user.first_name, last_name: user.last_name, username: user.username };
                }
                else {
                    return res.status(403).json({ status: 403, message: "Bad access_token" });
                }
            }
            catch (err) {
                console.log(err);
                return res.status(403).json({ status: 403, message: 'Maleformed access_token' });
            }
        }
    }
    else {
        return res.status(403).json({ status: 403, message: 'Access_token is missing' });
    }
    next();
});
exports.default = AuthFilter;
