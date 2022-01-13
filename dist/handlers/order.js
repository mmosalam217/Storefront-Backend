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
exports.order_route = void 0;
const order_1 = require("../models/order");
const AuthFilter_1 = __importDefault(require("../middelwares/AuthFilter"));
const orderDao = new order_1.OrderDao();
function placeOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cart = {
            user_id: req.body.authenticated.id,
            products: req.body.products
        };
        if (cart.products.length < 1)
            return res.status(400).json({ status: 400, message: 'Cart is empty, please add some purchases' });
        try {
            const order = yield orderDao.place(cart);
            if (order)
                return res.status(200).json({ status: 200, message: 'Order placed successfully', order });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error creating new order' });
        }
    });
}
function getUserCurrentOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield orderDao.getUserCurrentOrder(req.query.user_id);
            if (order) {
                return res.status(200).json({ status: 200, order });
            }
            else {
                return res.status(404).json({ status: 404, message: 'Currently no orders for user' });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: 'Error fetching current order for user' });
        }
    });
}
function getUserCompletedOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield orderDao.getCompletedOrders(req.query.user_id);
            return res.status(200).json({ status: 200, orders });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: 'Error fetching completed orders for user' });
        }
    });
}
const order_route = (app) => {
    app.post('/orders/place', AuthFilter_1.default, placeOrder);
    app.get('/orders/current', AuthFilter_1.default, getUserCurrentOrder);
    app.get('/orders/completed', AuthFilter_1.default, getUserCompletedOrders);
};
exports.order_route = order_route;
