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
const userDao = new user_1.UserDao();
const orderDao = new order_1.OrderDao();
const productDao = new product_1.ProductDao();
// We need an existing user with an order and products assiociated with the order to be created
function createUserAndOrder() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const username = generateRandomString();
        const userForm = { first_name: 'Test', last_name: 'User', username, password: 'Strong1password' };
        try {
            const user = yield userDao.create(userForm);
            const user_id = (_a = user) === null || _a === void 0 ? void 0 : _a.id;
            const product = yield productDao.create({ name: 'X', price: 10, category: 'Any' });
            const product_id = (_b = product) === null || _b === void 0 ? void 0 : _b.id;
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
    const { SUPERADMIN_USERNAME, SUPERADMIN_PASSWORD } = process.env;
    it('GET: /orders/current?user_id=x should return current order', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        // Authenticate admin to get the access_token back as the orders route is protected
        const auth_response = yield (0, supertest_1.default)(server_1.default).post('/users/authenticate')
            .send({ username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD });
        const token = (_a = auth_response.body) === null || _a === void 0 ? void 0 : _a.access_token;
        // We need to create a user with an order
        const tempOrder = yield createUserAndOrder();
        // Now we can get the current order by the user
        const currentOrderRes = yield (0, supertest_1.default)(server_1.default)
            .get(`/orders/current?user_id=${tempOrder === null || tempOrder === void 0 ? void 0 : tempOrder.user_id}`).set('Authorization', `Bearer ${token}`).send();
        const order = (_b = currentOrderRes.body) === null || _b === void 0 ? void 0 : _b.order;
        expect(order === null || order === void 0 ? void 0 : order.status).toEqual('active');
    }));
    it('GET: /orders/completed', () => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d, _e;
        // Authenticate admin to get the access_token back as the orders route is protected
        const auth_response = yield (0, supertest_1.default)(server_1.default).post('/users/authenticate')
            .send({ username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD });
        const token = (_c = auth_response.body) === null || _c === void 0 ? void 0 : _c.access_token;
        // We need to create a user with an order
        const order = yield createUserAndOrder();
        //Set the status to be completed
        yield orderDao.setOrderCompleted(order === null || order === void 0 ? void 0 : order.id);
        // Now we can get the current order by the user
        const completedORderRes = yield (0, supertest_1.default)(server_1.default).get(`/orders/completed?user_id=${order.user_id}`)
            .set('Authorization', `Bearer ${token}`).send();
        const orders = (_d = completedORderRes.body) === null || _d === void 0 ? void 0 : _d.orders;
        expect((_e = orders[0]) === null || _e === void 0 ? void 0 : _e.status).toEqual('completed');
    }));
    it('POST: /orders/place => Create a new order', () => __awaiter(void 0, void 0, void 0, function* () {
        var _f, _g, _h, _j, _k, _l;
        // Authenticate admin to get the access_token back as the orders route is protected
        const auth_response = yield (0, supertest_1.default)(server_1.default).post('/users/authenticate')
            .send({ username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD });
        const token = (_f = auth_response.body) === null || _f === void 0 ? void 0 : _f.access_token;
        const user_id = (_g = auth_response.body) === null || _g === void 0 ? void 0 : _g.user_id;
        // Create a product to make sure we add products which exist in our database
        const product = yield productDao.create({ name: 'X', price: 10, category: 'Any' });
        const product_id = (_h = product) === null || _h === void 0 ? void 0 : _h.id;
        // Place the order
        const cart = { user_id: user_id, products: [{ product_id, qty: 2 }] };
        const order_res = yield (0, supertest_1.default)(server_1.default).post('/orders/place')
            .set('Authorization', `Bearer ${token}`)
            .send(cart);
        const order = (_j = order_res.body) === null || _j === void 0 ? void 0 : _j.order;
        expect((_k = order) === null || _k === void 0 ? void 0 : _k.user_id).toEqual(user_id);
        expect((_l = order) === null || _l === void 0 ? void 0 : _l.order_items[0].product_id).toEqual(product_id);
    }));
});
