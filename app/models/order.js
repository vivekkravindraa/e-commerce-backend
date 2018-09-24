const mongoose = require('mongoose');
const shorthash = require('shorthash');
const { User } = require('./user');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    orderDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    total: {
        type: Number,
        default: 0
    },
    orderItems: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]
});

// first validates, if passes, then calls the pre 'save'
orderSchema.pre('validate', function(next) {
    let order = this;
    
    order.orderNumber = `DCT-${shorthash.unique(order.orderDate.toString()+order.orderDate.toString())}`;
    next();
})

orderSchema.pre('save', function(next) {
    let order = this;

    User.findOne({ _id: order.user }).populate('cartItems.product')
    .then((user) => {
        user.cartItems.forEach((inCart) => {
            let item = {
                product: inCart.product._id,
                quantity: inCart.quantity,
                price: inCart.product.price
            }
            order.orderItems.push(item);
            order.total += item.quantity * item.price;
            next();
        });
    })
    .catch((err) => {
        return Promise.reject(err);
    });
})

orderSchema.post('save',function(next){
    // TODO: Clear the orderItems
    next();
})

const Order = mongoose.model('Order', orderSchema);

module.exports = {
    Order
}