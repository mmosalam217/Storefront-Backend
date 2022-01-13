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
exports.ProductDao = void 0;
const database_1 = __importDefault(require("../database"));
class ProductDao {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM products;';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    filter(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                let sql = 'SELECT * FROM products';
                // Construct a criteria query..
                const where = [];
                if (filter.id)
                    where.push(`id=${filter.id}`);
                if (filter.name)
                    where.push(`name ILIKE '%${filter.name}%'`); // used ILIKE to ignore case
                if (filter.category)
                    where.push(`category='${filter.category}'`);
                // If there are query params appended, then attach them to the query
                if (where.length > 0)
                    sql += ' WHERE ' + where.join(' and ') + ';';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows.length > 0 ? result.rows : [];
            }
            catch (err) {
                console.log(err);
                throw new Error(err.message);
            }
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM products WHERE id=$1;';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    create(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *;';
                const result = yield conn.query(sql, [product.name, product.price, product.category]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                console.log(err);
                throw new Error(err.message);
            }
        });
    }
    getByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = `SELECT * FROM products WHERE category=$1;`;
                const result = yield conn.query(sql, [category]);
                conn.release();
                return result.rows;
            }
            catch (err) {
                console.log(err);
                throw new Error(err.message);
            }
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = `DELETE FROM products WHERE id=$1;`;
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
}
exports.ProductDao = ProductDao;
