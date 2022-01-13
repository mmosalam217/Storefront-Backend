"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PG_DATABASE, PG_DATABASE_TEST, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, ENV } = process.env;
const connection = new pg_1.Pool({
    database: ENV === 'dev' ? PG_DATABASE : PG_DATABASE_TEST,
    user: PG_USER,
    password: PG_PASSWORD,
    host: PG_HOST,
    port: PG_PORT // make typescript read it as a number, we must convert it as unkown first
});
exports.default = connection;
