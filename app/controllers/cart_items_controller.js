const express = require('express');
const { CartItem } = require('../models/cart_item');
const { authenticateUser } = require('../middlewares/authentication');
const { validateId } = require('../middlewares/utilities');
const _ = require('lodash');

const router = express.Router();

// localhost:3000/cart_items
router.get('/', authenticateUser, (req, res) => {
    let user = req.locals.user; 
    res.send(user.cartItems);
});

router.post('/', authenticateUser, (req, res) => {
    let user = req.locals.user; 
    let body = _.pick(req.body, ['product', 'quantity']);
    let cartItem = new CartItem(body);

    user.cartItems.push(cartItem);
    user.save()
    .then((user) => {
        res.send({
            cartItem,
            notice: 'successfully added the product to the cart'
        });
    }).catch((err) => {
        res.send(err); 
    });
});

router.put('/:id', validateId, authenticateUser, (req, res) => {
    let user = req.locals.user; 
    let id = req.params.id;
    let body = _.pick(req.body, ['quantity']);
    let inCart = user.cartItems.id(id);

    if(inCart) {
        Object.assign(inCart, body);     
    }
    user.save()
    .then((user) => {
        res.send({
            cartItem: inCart, 
            notice: 'successfully updated the cart'
        });
    }).catch((err) => {
        res.send(err);
    })
});

router.delete('/:id', validateId, authenticateUser, (req,res) => {
    let user = req.locals.user; 
    let id = req.params.id; 
    user.cartItems.id(id).remove();

    user.save().then((user) => {
        res.send({
            cartItems: user.cartItems,
            notice: 'successfully remove the product from cart'
        });
    });
});

module.exports = {
    cartItemsController: router
}