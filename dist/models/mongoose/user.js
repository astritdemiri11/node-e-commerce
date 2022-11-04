"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
});
userSchema.methods.addToCart = function addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cartProduct) => cartProduct.productId.toString() === product._id.toString());
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity,
        });
    }
    const updatedCart = {
        items: updatedCartItems,
    };
    this.cart = updatedCart;
    return this.save();
};
userSchema.methods.removeFromCart = function removeFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => item.productId.toString() !== productId.toString());
    this.cart.items = updatedCartItems;
    return this.save();
};
userSchema.methods.clearCart = function clearCart() {
    this.cart = { items: [] };
    return this.save();
};
exports.default = mongoose_1.default.model('User', userSchema);
