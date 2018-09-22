const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNumber: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        default: 'confirmed',
        enum: ['confirmed', 'pending', 'cancelled']
    },
    orderTotal: {
        type: Number
    },
    orderItems: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            price: {
                type: Number
            },
            quantity: {
                type: Number
            }
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

orderSchema.pre('save', function(next) {
    if(!this.orderTotal) {
        this.orderTotal = this.orderItems.price * this.orderItems.quantity;
    }
    next();
})

const { Order } = mongoose.model('Order', orderSchema);

module.exports = {
    Order
}