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
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const user_1 = require("../../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userDao = new user_1.UserDao();
function createUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const userForm = { first_name: generateRandomString(), last_name: generateRandomString(),
            username: generateRandomString(), password: 'Strong1password' };
        try {
            const user = yield userDao.create(userForm);
            return user;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
}
function generateAccessToken(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = jsonwebtoken_1.default.sign({ user_id: user.id, username: user.username }, process.env.JWT_SECRET);
            return token;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
}
function generateRandomString() {
    return Math.random().toString(16).substring(2, 6);
}
describe('User Api Specs', () => {
    it('POST: /users creates an new user', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const admin = yield createUser();
        const token = yield generateAccessToken(admin);
        const userForm = { first_name: generateRandomString(), last_name: generateRandomString(),
            username: generateRandomString(), password: 'Strong1password' };
        const res = yield (0, supertest_1.default)(server_1.default).post('/users').set('Authorization', `Bearer ${token}`).send(userForm);
        const user = (_a = res.body) === null || _a === void 0 ? void 0 : _a.user;
        expect(user.username).toEqual(userForm.username);
    }));
    it('GET: /index returns array of users', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createUser();
        const token = yield generateAccessToken(user);
        const res = yield (0, supertest_1.default)(server_1.default).get('/users/index').set('Authorization', `Bearer ${token}`).send();
        expect(res.status).toEqual(200);
    }));
    it('GET: /:id return user with id equals 2', () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield createUser();
        const token = yield generateAccessToken(newUser);
        const res = yield (0, supertest_1.default)(server_1.default).get(`/users/${newUser.id}`).set('Authorization', `Bearer ${token}`).send();
        const user = res.body.user;
        expect(user.id).toEqual(newUser.id);
    }));
});
