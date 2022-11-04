"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const path_2 = __importDefault(require("../path"));
const _404_1 = __importDefault(require("../../routes/sequelize/404"));
const admin_1 = __importDefault(require("../../routes/sequelize/admin"));
const shop_1 = __importDefault(require("../../routes/sequelize/shop"));
const user_1 = __importDefault(require("../../models/sequelize/user"));
const app = (0, express_1.default)();
const publicDir = path_1.default.join(path_2.default, 'public');
app.set('view engine', 'ejs');
app.use(express_1.default.static(publicDir));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    user_1.default.findByPk(1).then((user) => {
        req.user = user;
        next();
    });
});
app.use('/admin', admin_1.default);
app.use(shop_1.default);
app.use(_404_1.default);
module.exports = app;
