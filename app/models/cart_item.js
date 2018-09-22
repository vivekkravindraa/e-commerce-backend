const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
        // custom validations
    }
});

// cartItemSchema.pre('save')
// cartItemSchema.statics
// cartItemSchema.methods

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = {
    cartItemSchema, 
    CartItem
}