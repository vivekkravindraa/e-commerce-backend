const express = require('express');

const { categoriesController } = require('../app/controllers/categories_controller');
const { productsController } = require('../app/controllers/products_controller');
const { usersController } = require('../app/controllers/users_controller');

const router = express.Router();

router.use('/categories', categoriesController);
router.use('/products', productsController);
router.use('/users', usersController);

module.exports = {
    router
}