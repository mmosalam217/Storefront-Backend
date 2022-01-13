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
exports.UserDao = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserDao {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM users;';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM users WHERE id=$1;';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Hash the password
                const pw_hash = yield bcrypt_1.default.hash(user.password, 10);
                const conn = yield database_1.default.connect();
                const sql = 'INSERT INTO users (first_name, last_name, username, password) VALUES($1, $2, $3, $4) RETURNING *;';
                const result = yield conn.query(sql, [user.first_name, user.last_name, user.username, pw_hash]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                console.log(err);
                throw new Error(err.message);
            }
        });
    }
    // Load userdetails by username...
    loadUserDetails(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM users WHERE username=$1;';
                const result = yield conn.query(sql, [username]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    // Onlz used to clear data after tests which include brute-force creating users
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'DELETE FROM users;';
                yield conn.query(sql);
                conn.release();
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
}
exports.UserDao = UserDao;
