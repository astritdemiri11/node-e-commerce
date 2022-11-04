"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = new sequelize_1.Sequelize(process.env.SQL_DATABASE || '', process.env.SQL_USER || '', process.env.SQL_PASSWORD || '', {
    dialect: 'mysql',
    host: 'localhost',
});
