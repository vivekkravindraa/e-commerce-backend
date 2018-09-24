const express = require('express');
const { CartItem } = require('../models/cart_item');
const { authenticateUser } = require('../middlewares/authentication');
const { validateId } = require('../middlewares/utilities');
const { User } = require('../models/user');
const _ = require('lodash');

const router = express.Router();

// localhost:3000/cart_items
router.get('/', authenticateUser, (req, res) => {
    let user = req.locals.user; 
    res.send(user.cartItems);
});

router.post('/', authenticateUser, (req, res) => {
    let user = req.locals.user; 
    let body = _.pick(req.body, ['product', 'price', 'quantity']);
    let cartItem = new CartItem(body);

    // on adding the 'same new product', incrementing quantity
    let result = user.cartItems.find((item) => {
        return item.product.equals(cartItem.product);
    });

    if(result) {
        result.quantity++;
    } else {
        user.cartItems.push(cartItem);
    }

    // user.cartItems.push(cartItem);
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
    let body = _.pick(req.body, ['price','quantity']);
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
    })
    .catch((err) => {
        res.send(err);
    })
});

router.delete('/empty', authenticateUser, (req,res) => {
    let user = req.locals.user;
    console.log(user);
    
    // clearing the cartItems array for specific user
    User.findByIdAndUpdate(user._id, {$set: {cartItems: []}}, {new: true})
    .then((user) => {
        res.send(user);
    })
    .catch((err) => {
        res.send(err);
    })
});

router.delete('/:id', validateId, authenticateUser, (req,res) => {
    let user = req.locals.user; 
    let id = req.params.id; 
    
    user.cartItems.id(id).remove();
    user.save()
    .then((user) => {
        res.send({
            cartItems: user.cartItems,
            notice: 'successfully removed the product from cart'
        });
    })
    .catch((err) => {
        res.send(err);
    })
});

module.exports = {
    cartItemsController: router
}