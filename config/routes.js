const express = require('express');

const { categoriesController } = require('../app/controllers/categories_controller');
const { cartItemsController } = require('../app/controllers/cart_items_controller');
const { productsController } = require('../app/controllers/products_controller');
const { usersController } = require('../app/controllers/users_controller');

const router = express.Router();

router.use('/categories', categoriesController);
router.use('/cart_items', cartItemsController);
router.use('/products', productsController);
router.use('/users', usersController);

module.exports = {
    router
}