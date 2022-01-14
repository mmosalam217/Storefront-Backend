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
function generateRandomString() {
    return Math.random().toString(16).substring(2, 6);
}
describe('User Api Specs', () => {
    const { SUPERADMIN_USERNAME, SUPERADMIN_PASSWORD } = process.env;
    it('POST: /users creates an new user', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        // Authenticate admin to get the access_token back as the user creation route is protected
        const auth_response = yield (0, supertest_1.default)(server_1.default).post('/users/authenticate')
            .send({ username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD });
        const token = (_a = auth_response.body) === null || _a === void 0 ? void 0 : _a.access_token;
        const userForm = { first_name: generateRandomString(), last_name: generateRandomString(),
            username: generateRandomString(), password: 'Strong1password' };
        const res = yield (0, supertest_1.default)(server_1.default).post('/users').set('Authorization', `Bearer ${token}`).send(userForm);
        const user = (_b = res.body) === null || _b === void 0 ? void 0 : _b.user;
        expect(user === null || user === void 0 ? void 0 : user.username).toEqual(userForm.username);
    }));
    it('GET: /index returns array of users', () => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        // Authenticate admin to get the access_token back as the user creation route is protected
        const auth_response = yield (0, supertest_1.default)(server_1.default).post('/users/authenticate')
            .send({ username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD });
        const token = (_c = auth_response.body) === null || _c === void 0 ? void 0 : _c.access_token;
        const res = yield (0, supertest_1.default)(server_1.default).get('/users/index').set('Authorization', `Bearer ${token}`).send();
        expect(res.status).toEqual(200);
    }));
    it('GET: /:id return user with id', () => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e;
        // Authenticate admin to get the access_token back as the user creation route is protected
        const auth_response = yield (0, supertest_1.default)(server_1.default).post('/users/authenticate')
            .send({ username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD });
        const token = (_d = auth_response.body) === null || _d === void 0 ? void 0 : _d.access_token;
        // Hard user creation to get an actual id registerd into DB..
        const newUser = yield createUser();
        const res = yield (0, supertest_1.default)(server_1.default).get(`/users/${newUser.id}`).set('Authorization', `Bearer ${token}`).send();
        const user = (_e = res.body) === null || _e === void 0 ? void 0 : _e.user;
        expect(user === null || user === void 0 ? void 0 : user.id).toEqual(newUser === null || newUser === void 0 ? void 0 : newUser.id);
    }));
});
