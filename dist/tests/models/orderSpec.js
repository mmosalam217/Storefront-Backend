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
const order_1 = require("../../models/order");
const user_1 = require("../../models/user");
const product_1 = require("../../models/product");
const orderDao = new order_1.OrderDao();
const userDao = new user_1.UserDao();
const productDao = new product_1.ProductDao();
function generateRandomString() {
    return Math.random().toString(16).substring(2, 6);
}
// We need an existing user with an order and products assiociated with the order to be created
function createUserAndOrder() {
    return __awaiter(this, void 0, void 0, function* () {
        const username = generateRandomString();
        const userForm = { first_name: 'Test', last_name: 'User', username, password: 'Strong1password' };
        try {
            const user = yield userDao.create(userForm);
            const user_id = user.id;
            const product = yield productDao.create({ name: 'X', price: 10, category: 'Any' });
            const product_id = product.id;
            const cart = { user_id: user_id, products: [{ product_id, qty: 2 }] };
            const order = yield orderDao.place(cart);
            return order;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
}
describe('Order Model Specs', () => __awaiter(void 0, void 0, void 0, function* () {
    it('should return current order of user', () => __awaiter(void 0, void 0, void 0, function* () {
        createUserAndOrder().then((order) => __awaiter(void 0, void 0, void 0, function* () {
            const current = yield orderDao.getUserCurrentOrder(order.user_id);
            expect(current.user_id).toEqual(order.user_id);
        }));
    }));
    it('should return a list of completed orders', () => __awaiter(void 0, void 0, void 0, function* () {
        createUserAndOrder().then((order) => __awaiter(void 0, void 0, void 0, function* () {
            // We need to set the created order to completed as the orders are created with an active status by default
            yield orderDao.setOrderCompleted(order.id);
            const orders = yield orderDao.getCompletedOrders(order.user_id);
            console.log(orders);
            expect(orders.length).toEqual(1);
        }));
    }));
}));
