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
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../models/user");
const userDao = new user_1.UserDao();
function generateRandomString() {
    return Math.random().toString(16).substring(2, 6);
}
describe('User Model Specs', () => {
    it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const username = generateRandomString();
        const userForm = { first_name: 'Test', last_name: 'User', username, password: 'Strong1password' };
        userDao.create(userForm).then((user) => {
            expect(user.username).toEqual(username);
        });
    }));
    it('should return an array of users', () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield userDao.index();
        expect(users).toBeInstanceOf(Array);
    }));
    it('should return user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const username = generateRandomString();
        userDao.create({ first_name: 'Test', last_name: 'User', username, password: 'Strong1password' })
            .then((user1) => {
            userDao.show(user1.id).then((user2) => {
                expect(user2.username).toEqual(username);
            });
        });
    }));
});
