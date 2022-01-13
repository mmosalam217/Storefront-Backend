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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const product_1 = require("../../models/product");
const user_1 = require("../../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const productDao = new product_1.ProductDao();
const userDao = new user_1.UserDao();
function generateAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const userForm = { first_name: generateRandomString(), last_name: generateRandomString(), username: generateRandomString(), password: 'Strong1password' };
        try {
            const user = yield userDao.create(userForm);
            const token = jsonwebtoken_1.default.sign({ user_id: user.id, username: user.username }, process.env.JWT_SECRET);
            //const authenticated =  await request(app).post('/users/authenticate').send({username: user.username, password: user.password})
            //const access_token = authenticated.body.access_token as string
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
describe('Product Api Test', () => {
    it('GET: /products/index should return an array of products', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield (0, supertest_1.default)(server_1.default).get('/products/index').send();
            const products = res.body.products;
            expect(res.status).toEqual(200);
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }));
    it('POST: /products should create new product', () => __awaiter(void 0, void 0, void 0, function* () {
        generateAccessToken().then((token) => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.default).post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Samsung Galaxy', price: 500, category: 'Smartphone' });
            const product = res.body.product;
            expect(product.name).toEqual('Samsung Galaxy');
        })).catch(err => {
            console.log(err);
            throw new Error(err.message);
        });
    }));
    it('GET: /products?category=smartphone', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const product = yield productDao.create({ name: 'Samsung Galaxy', price: 500, category: 'Smartphone' });
            const prodid = product.id;
            const res = yield (0, supertest_1.default)(server_1.default).get('/products?category=Smartphone').send();
            const resultList = (_a = res.body) === null || _a === void 0 ? void 0 : _a.products;
            const getProduct = resultList[0];
            expect(getProduct.category).toEqual(product.category);
            yield productDao.deleteById(prodid);
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }));
    it('GET: /products/:id should return product with the id given', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield productDao.create({ name: 'Samsung Galaxy', price: 500, category: 'Smartphone' });
            const prodid = product.id;
            const res = yield (0, supertest_1.default)(server_1.default).get(`/products/${prodid}`).send();
            const getProduct = res.body.product;
            const id = product.id;
            expect(getProduct.id).toEqual(id);
            yield productDao.deleteById(id);
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }));
});
