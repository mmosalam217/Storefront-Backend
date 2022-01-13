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
const product_1 = require("../../models/product");
const productDao = new product_1.ProductDao();
describe('Product Model Spec', () => {
    it('should create a new product', () => __awaiter(void 0, void 0, void 0, function* () {
        const productDetails = { name: 'Nokia', price: 10, category: 'Smartphone' };
        const product = yield productDao.create(productDetails);
        expect(product.name).toBe(productDetails.name);
    }));
    it('should return array of products', () => __awaiter(void 0, void 0, void 0, function* () {
        const products = yield productDao.index();
        expect(products).toBeInstanceOf(Array);
    }));
    it('should return a product with a given id', () => __awaiter(void 0, void 0, void 0, function* () {
        const productDetails = { name: 'Nokia', price: 10, category: 'Smartphone' };
        const product = yield productDao.create(productDetails);
        const newProduct = yield productDao.show(product.id);
        expect(newProduct).toEqual(product);
    }));
    it('should return products by category', () => __awaiter(void 0, void 0, void 0, function* () {
        const products = yield productDao.filter({ category: 'Smartphone' });
        expect(products[0].category).toEqual('Smartphone');
    }));
});
