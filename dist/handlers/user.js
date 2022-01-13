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
exports.user_route = void 0;
const user_1 = require("../models/user");
const AuthFilter_1 = __importDefault(require("../middelwares/AuthFilter"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userDao = new user_1.UserDao();
function findAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield userDao.index();
            return res.status(200).json({ status: 200, users });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error fetching users' });
        }
    });
}
function findById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const user = yield userDao.show(id);
            if (user) {
                return res.status(200).json({ status: 200, user });
            }
            else {
                return res.status(404).json({ status: 404, message: `User not found with id ${id}` });
            }
        }
        catch (err) {
            return res.status(500).json({ status: 500, message: 'Error fetching user' });
        }
    });
}
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userDto = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password
        };
        // Validate inputs
        if (userDto.first_name.trim().length < 3 || userDto.last_name.trim().length < 3)
            return res.status(400).json({ status: 400, message: `First- and lastname should be at least 3 characters length` });
        // Check if user already exists..
        const userExists = yield userDao.loadUserDetails(userDto.username);
        if (userExists)
            return res.status(400).json({ status: 400, message: 'Username already exists or wrong' });
        // Check if password is 8 chars length, contains at least one number, one uppercase char and one lowercase char
        const strongPasswordCriteria = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        if (!strongPasswordCriteria.test(userDto.password))
            return res.status(400).json({
                status: 400,
                message: `Password must be at least 8 chars length, contains at least one number, one uppercase char and one lowercase char`
            });
        // Create the user...
        try {
            const user = yield userDao.create(userDto);
            return res.status(200).json({ status: 200, user });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error creating user' });
        }
    });
}
function authenticate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = {
            username: req.body.username,
            password: req.body.password
        };
        try {
            const user = yield userDao.loadUserDetails(credentials.username);
            if (!user)
                return res.status(404).json({ status: 404, message: "User does not exist, please register or enter right credentials" });
            // Check if the credentials are right
            const isAuthenticated = yield bcrypt_1.default.compare(credentials.password, user.password);
            if (!isAuthenticated)
                return res.status(403).json({ status: 403, message: 'Bad credentials' });
            // Return a jwt access_token if user is authenticated..
            const secret = process.env.JWT_SECRET;
            const expiresIn = Date.now() + 60 * 60; // for an hour as a starter
            const payload = { user_id: user.id, username: user.username };
            const access_token = yield jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
            if (access_token)
                return res.status(200).json({ status: 200, message: 'Login success', access_token, expires_in: expiresIn });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error occured during authentication' });
        }
    });
}
const user_route = (app) => {
    app.get('/users/index', AuthFilter_1.default, findAll);
    app.get('/users/:id', AuthFilter_1.default, findById);
    app.post('/users', AuthFilter_1.default, create);
    app.post('/users/authenticate', authenticate);
};
exports.user_route = user_route;
