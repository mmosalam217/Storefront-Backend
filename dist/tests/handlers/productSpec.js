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
const productDao = new product_1.ProductDao();
describe('Product Api Test', () => {
    const { SUPERADMIN_USERNAME, SUPERADMIN_PASSWORD } = process.env;
    it('GET: /products/index should return an array of products', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const res = yield (0, supertest_1.default)(server_1.default).get('/products/index').send();
            const products = (_a = res.body) === null || _a === void 0 ? void 0 : _a.products;
            expect(res.status).toEqual(200);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }));
    it('POST: /products should create new product', () => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        // Authenticate admin to get the access_token back as the product creation route is protected
        const auth_response = yield (0, supertest_1.default)(server_1.default).post('/users/authenticate')
            .send({ username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD });
        const token = (_b = auth_response.body) === null || _b === void 0 ? void 0 : _b.access_token;
        const res = yield (0, supertest_1.default)(server_1.default).post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Samsung Galaxy', price: 500, category: 'Smartphone' });
        const product = (_c = res.body) === null || _c === void 0 ? void 0 : _c.product;
        expect(product === null || product === void 0 ? void 0 : product.name).toEqual('Samsung Galaxy');
    }));
    it('GET: /products?category=smartphone', () => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e;
        try {
            const product = yield productDao.create({ name: 'Samsung Galaxy', price: 500, category: 'Smartphone' });
            const prodid = (_d = product) === null || _d === void 0 ? void 0 : _d.id;
            const res = yield (0, supertest_1.default)(server_1.default).get('/products?category=Smartphone').send();
            const resultList = (_e = res.body) === null || _e === void 0 ? void 0 : _e.products;
            const getProduct = resultList[0];
            expect(getProduct === null || getProduct === void 0 ? void 0 : getProduct.category).toEqual(product.category);
            yield productDao.deleteById(prodid);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }));
    it('GET: /products/:id should return product with the id given', () => __awaiter(void 0, void 0, void 0, function* () {
        var _f, _g;
        try {
            const product = yield productDao.create({ name: 'Samsung Galaxy', price: 500, category: 'Smartphone' });
            const prodid = product.id;
            const res = yield (0, supertest_1.default)(server_1.default).get(`/products/${prodid}`).send();
            const getProduct = (_f = res.body) === null || _f === void 0 ? void 0 : _f.product;
            const id = (_g = product) === null || _g === void 0 ? void 0 : _g.id;
            expect(getProduct === null || getProduct === void 0 ? void 0 : getProduct.id).toEqual(id);
            yield productDao.deleteById(id);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }));
});
