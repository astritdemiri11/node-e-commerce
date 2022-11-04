"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.connectionLink = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/mongoose/user"));
exports.connectionLink = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ihyidt0.mongodb.net/${process.env.MONGO_DATABASE}?w=majority`;
const connect = (callback) => {
    mongoose_1.default.connect(`${exports.connectionLink}&retryWrites=true`).then(() => {
        user_1.default.findOne().then((user) => {
            if (!user) {
                const newUser = new user_1.default({
                    name: 'Astrit Demiri',
                    email: 'contact@astritdemiri.com',
                    cart: {
                        items: []
                    }
                });
                newUser.save();
            }
        });
        callback();
    }).catch((error) => {
        console.log(error);
    });
};
exports.connect = connect;
