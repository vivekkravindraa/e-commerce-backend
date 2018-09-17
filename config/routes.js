const express = require('express');
const { categoriesController } = require('../app/controllers/categories_controller');
const router = express.Router();

router.use('/categories',categoriesController);

module.exports = {
    router
}