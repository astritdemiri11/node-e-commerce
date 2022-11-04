import mongoose from 'mongoose'

const { Schema } = mongoose;

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

userSchema.methods.addToCart = function addToCart(product: any) {
  const cartProductIndex = this.cart.items.findIndex(
    (cartProduct: any) => cartProduct.productId.toString() === product._id.toString(),
  );
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
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

userSchema.methods.removeFromCart = function removeFromCart(productId: any) {
  const updatedCartItems = this.cart.items.filter(
    (item: any) => item.productId.toString() !== productId.toString(),
  );
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function clearCart() {
  this.cart = { items: [] };
  return this.save();
};

export default mongoose.model('User', userSchema);
