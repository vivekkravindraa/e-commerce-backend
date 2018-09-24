const express = require('express');
const { Order } = require('../models/order');
const { authenticateUser } = require('../middlewares/authentication');
const { validateId } = require('../middlewares/utilities');
const { User } = require('../models/user');
const _ = require('lodash');

const router = express.Router();

router.get('/', authenticateUser, (req,res) => {
    let user = req.locals.user;

    Order.find({ user: user._id })
    .then((orders) => {
        res.send(orders);
    })
    .catch((err) => {
        res.send(err);
    })
})

router.post('/', authenticateUser, (req, res) => {
    let user = req.locals.user;
    let order = new Order();

    order.user = user._id;
    order.save()
    .then((order) => {
        res.send({
            order,
            notice: 'successfully created an order'
        });
    }).catch((err) => {
        res.send(err); 
    });
});

module.exports = {
    ordersController: router
}