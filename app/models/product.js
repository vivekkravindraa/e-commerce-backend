const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String, 
        required: true, 
        minlength: 2,
        maxlength: 64
    },
    price: {
        type: Number,
        required: true, 
        min: 1
    },
    description: {
        type: String,
        required: true, 
        minlength: 5, 
        maxlength: 1000
    },
    category: {
        type: Schema.Types.ObjectId, 
        required: true,
        ref: 'Category'
    }, 
    codEligible: {
        type: Boolean, 
        default: true, 
        required: true, 
        validate: {
            validator: function(value){
                return !(this.price >= 25000 && this.codEligible)
            },
            message: function(){
                return 'products are not eligible for cod if the price is greater than or equal to 25000';
            }
        }
    }, 
    stock: {
        type: Number, 
        required: true, 
        min: 0
    },
    maxUnitPurchase: {
        type: Number, 
        required: true, 
        min: 1
    },
    lowStockAlert: {
        type: Number, 
        required: true, 
        min: 0
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = {
    Product
}

// {
//     "name": "iphone xs",
//     "price": 125000,
//     "description": "Apple's new product.",
//     "category": "",
//     "codEligible": true,
//     "stock": 5,
//     "maxUnitPurchase": 2,
//     "lowStockAlert": 10
// }