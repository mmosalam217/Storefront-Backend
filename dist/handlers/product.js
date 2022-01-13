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
exports.product_route = void 0;
const product_1 = require("../models/product");
const AuthFilter_1 = __importDefault(require("../middelwares/AuthFilter"));
const productDao = new product_1.ProductDao();
function loadProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield productDao.index();
            return res.status(200).json({ status: 200, products: products });
        }
        catch (err) {
            return res.status(400).json({ status: 400, message: 'Error fetching products' });
        }
    });
}
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const productDto = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };
        // Validate inputs
        if (productDto.name.trim().length < 1)
            return res.status(400).json({ status: 400, message: "Enter a valid product name" });
        if (productDto.price <= 0)
            res.status(400).json({ status: 400, message: "Price must not equal 0" });
        try {
            const product = yield productDao.create(productDto);
            if (product)
                return res.status(200).json({ status: 200, product });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Technical error occured and couldn\'t create product. Please try again later' });
        }
    });
}
function findById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const product = yield productDao.show(id);
            if (product) {
                return res.status(200).json({ status: 200, product });
            }
            else {
                return res.status(404).json({ status: 404, message: `Product with id ${id} couldn't be found` });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: `Technical error occured and couldn\'t fetch product. Please try again later` });
        }
    });
}
function filterBy(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const filter = {
            id: req.query.id,
            name: req.query.name,
            category: req.query.category
        };
        try {
            const products = yield productDao.filter(filter);
            return res.status(200).json({ status: 200, products: products });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error fetching products' });
        }
    });
}
const product_route = (app) => {
    app.get("/products/index", loadProducts);
    app.get("/products", filterBy);
    app.get("/products/:id", findById);
    app.post("/products", AuthFilter_1.default, createProduct);
};
exports.product_route = product_route;
