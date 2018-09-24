const express = require('express');
const { Order } = require('../models/order');
const { authenticateUser } = require('../middlewares/authentication');
const { validateId } = require('../middlewares/utilities');
const { User } = require('../models/user');
const _ = require('lodash');

const router = express.Router();

router.get('/', authenticateUser, (req,res) => {
    let user = req.locals.user; 
    res.send(user.orderItems);
})

router.post('/', authenticateUser, (req, res) => {
    let user = req.locals.user; 
    let body = _.pick(req.body, []);
    let orderItem = new Order(body);

    user.orderItems.push(orderItem);
    user.save()
    .then((user) => {
        res.send({
            orderItem,
            notice: 'successfully added the product to the orders'
        });
    }).catch((err) => {
        res.send(err); 
    });
});

router.put('/:id', validateId, authenticateUser, (req,res) => {
    let user = req.locals.user; 
    let id = req.params.id;
    let body = _.pick(req.body, []);
    let inOrder = user.orderItems.id(id);

    if(inOrder) {
        Object.assign(inOrder, body);     
    }

    user.save()
    .then((user) => {
        res.send({
            orderItem: inOrder, 
            notice: 'successfully updated the order'
        });
    })
    .catch((err) => {
        res.send(err);
    })
})

router.delete('/empty', authenticateUser, (req,res) => {
    let user = req.locals.user;

    // clearing the orderItems array for specific user
    User.findByIdAndUpdate(user._id, {$set: {orderItems: []}}, {new: true})
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
    
    user.orderItems.id(id).remove();
    user.save()
    .then((user) => {
        res.send({
            orderItems: user.orderItems,
            notice: 'successfully removed the product from cart'
        });
    })
    .catch((err) => {
        res.send(err);
    })
});

module.exports = {
    ordersController: router
}