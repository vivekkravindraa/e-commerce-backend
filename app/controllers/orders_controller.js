const express = require('express');
const { Order } = require('../models/order');
const { authenticateUser, authorizeUser } = require('../middlewares/authentication');
const { validateId } = require('../middlewares/utilities');
const _ = require('lodash');

const router = express.Router();

router.get('/',(req,res) => {
    Order.find()
    .then((orders) => {
        res.send(orders);
    })
    .catch((err) => {
        res.send(err);
    })
})

router.post('/',(req,res) => {
    let body = _.pick(req.body, ['orderNumber','orderItems','user']);
    let order = new Order(body);

    order.save()
    .then((order) => {
        res.send(order);
    })
    .catch((err) => {
        res.send(err);
    })
})

router.put('/:id', validateId, authenticateUser, authorizeUser, (req,res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['orderNumber','orderItems','user']);

    Order.findOneAndUpdate(id, {$set: body}, {new: true})
    .then((order) => {
        res.send(order);
    })
    .catch((err) => {
        res.send(err);
    })
})

module.exports = {
    ordersController: router
}