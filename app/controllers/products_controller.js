const express = require('express');
const { Product } = require('../models/product');
const { authenticateUser, authorizeUser } = require('../middlewares/authentication');
const { validateId } = require('../middlewares/utilities');
const _ = require('lodash');

const router = express.Router();

// localhost:3000/products/
router.get('/', (req, res) => {
    Product.find()
    .then((products) => {
        res.send(products);
    })
    .catch((err) => {
        res.send(err);
    });
});

router.post('/', authenticateUser, authorizeUser, (req, res) => {
    // strong parameters
    let body = _.pick(req.body, ['name','price', 'description', 'category', 'codEligible', 'stock', 'maxUnitPurchase', 'lowStockAlert']);
    let product = new Product(body);

    product.save()
    .then((product) => {
        res.send({
            product, 
            notice: 'successfully created product'
        });
    })
    .catch((err) => {
        res.send(err);
    });
});

router.put('/:id', validateId, authenticateUser, authorizeUser, (req, res) => {
    let id = req.params.id; 
    let body = _.pick(req.body, ['name', 'price', 'description', 'category', 'codEligible', 'stock', 'maxUnitPurchase', 'lowStockAlert']);

    // 1st approach, find the record, update it and then save().
    // Advantage: in custom validator 'this' will refer to the "object"

    Product.findById(id)
    .then((product) => {
        Object.assign(product, body); 
        return product.save()
    })
    .then((product) => {
        res.send(product);
    })
    .catch((err) => {
        res.send(err);
    });

    // 2nd approad, find and update using Model.findByIdAndUpdate().
    // Advantage: you are not bringing the object back into memory
    // Disadvantage: is 'this' will refer to the "class"

    // Product.findByIdAndUpdate(id, { $set: body}, { new: true, runValidators: true, context: 'query'})
    // .then((product) => {
    //     res.send(product);
    // })
    // .catch((err) => {
    //     res.send(err); 
    // });

});

module.exports = {
    productsController: router
}