"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const product_1 = require("./handlers/product");
const user_1 = require("./handlers/user");
const order_1 = require("./handlers/order");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const address = "0.0.0.0:3000";
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
(0, product_1.product_route)(app);
(0, user_1.user_route)(app);
(0, order_1.order_route)(app);
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
exports.default = app;
