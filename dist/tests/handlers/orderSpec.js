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
const user_1 = require("../../models/user");
const order_1 = require("../../models/order");
const product_1 = require("../../models/product");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userDao = new user_1.UserDao();
const orderDao = new order_1.OrderDao();
const productDao = new product_1.ProductDao();
function generateAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userForm = { first_name: generateRandomString(), last_name: generateRandomString(), username: generateRandomString(), password: 'Strong1password' };
            const user = yield userDao.create(userForm);
            const token = jsonwebtoken_1.default.sign({ user_id: user.id, username: user.username }, process.env.JWT_SECRET);
            return token;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
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
function generateRandomString() {
    return Math.random().toString(16).substring(2, 6);
}
describe('Order Api Test', () => {
    it('GET: /orders/current?user_id=x should return current order', () => __awaiter(void 0, void 0, void 0, function* () {
        generateAccessToken().then((token) => __awaiter(void 0, void 0, void 0, function* () {
            // We need to create a user with an order
            const tempOrder = yield createUserAndOrder();
            // Now we can get the current order by the user
            const currentOrderRes = yield (0, supertest_1.default)(server_1.default)
                .get(`/orders/current?user_id=${tempOrder.user_id}`).set('Authorization', `Bearer ${token}`).send();
            const order = currentOrderRes.body.order;
            expect(order.status).toEqual('active');
        }));
    }));
    it('GET: /orders/completed', () => __awaiter(void 0, void 0, void 0, function* () {
        generateAccessToken().then((token) => __awaiter(void 0, void 0, void 0, function* () {
            // We need to create a user with an order
            const order = yield createUserAndOrder();
            //Set the status to be completed
            yield orderDao.setOrderCompleted(order.id);
            // Now we can get the current order by the user
            const completedORderRes = yield (0, supertest_1.default)(server_1.default).get(`/orders/completed?user_id=${order.user_id}`)
                .set('Authorization', `Bearer ${token}`).send();
            const orders = completedORderRes.body.orders;
            expect(orders[0].status).toEqual('completed');
        }));
    }));
});
