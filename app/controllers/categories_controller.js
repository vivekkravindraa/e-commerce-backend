const express = require('express');
const _ = require('lodash');
const { Category } = require('../models/category');
const router = express.Router();

router.get('/',(req,res) => {
    Category.find()
    .then((categories) => {
        res.send(categories);
    })
    .catch((err) => {
        res.send(err);
    })
})

router.get('/:id',(req,res) => {
    let id = req.params.id;

    Category.findById(id)
    .then((category) => {
        res.send(category);
    })
    .catch((err) => {
        res.send(err);
    })
})

router.post('/',(req,res) => {
    let body = _.pick(req.body, ['name']);
    let category = new Category(body);

    category.save()
    .then((category) => {
        res.send(category);
    })
    .catch((err) => {
        res.send(err);
    })
})

router.put('/:id',(req,res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name']);

    Category.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then((category) => {
        res.send(category);
    })
    .catch((err) => {
        res.send(err);
    })
})

router.delete('/:id',(req,res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id)
    .then((category) => {
        res.send(category);
    })
    .catch(() => {
        res.send(err);
    })
})

module.exports = {
    categoriesController: router
}