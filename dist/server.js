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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const product_1 = require("./handlers/product");
const user_1 = require("./handlers/user");
const order_1 = require("./handlers/order");
const user_2 = require("./models/user");
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
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`starting app on: ${address}`);
        const userDao = new user_2.UserDao();
        try {
            yield userDao.createSuperAdminIfNotExist();
        }
        catch (error) {
            console.error(error);
        }
    });
});
exports.default = app;
