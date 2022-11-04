"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const mongoose = __importStar(require("../../connection/mongoose"));
const user_1 = __importDefault(require("../../models/mongoose/user"));
const _404_1 = __importDefault(require("../../routes/mongoose/404"));
const admin_1 = __importDefault(require("../../routes/mongoose/admin"));
const auth_1 = __importDefault(require("../../routes/mongoose/auth"));
const shop_1 = __importDefault(require("../../routes/mongoose/shop"));
const path_2 = __importDefault(require("../path"));
const app = (0, express_1.default)();
const store = new connect_mongodb_session_1.default(express_session_1.default)({
    uri: mongoose.connectionLink,
    collection: 'sessions',
});
const publicDir = path_1.default.join(path_2.default, 'public');
app.set('view engine', 'ejs');
app.use(express_1.default.static(publicDir));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store,
}));
app.use((req, res, next) => {
    user_1.default.findById(req.session.user._id)
        .then((user) => {
        req.user = user;
        next();
    });
});
app.use('/admin', admin_1.default);
app.use(auth_1.default);
app.use(shop_1.default);
app.use(_404_1.default);
exports.default = app;
