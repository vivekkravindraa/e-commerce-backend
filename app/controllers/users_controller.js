const express = require('express');
const { User } = require('../models/user');
const { authenticateUser } = require('../middlewares/authentication');
const _ = require('lodash');

const router = express.Router();

router.get('/',(req,res) => {
    User.find()
    .then((users) => {
        res.send(users);
    })
    .catch((err) => {
        res.send(err);
    })
});

router.post('/', (req, res) => {
    let body = _.pick(req.body, ['username', 'email', 'password', 'role']);
    let user = new User(body);
    user.save().then((user) => {
        return user.generateToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.send(err); 
    });
});

// localhost:3000/users/wishlist
router.post('/wishlist', authenticateUser, (req,res) => {
    let user = req.locals.user;
    let body = _.pick(req.body, ['product']);

    user.wishlists.push(body)
    user.save()
    .then((user) => {
        res.send(user);
    })
    .catch((err) => {
        res.send(err);
    })

});

router.get('/profile', authenticateUser, (req, res) => {
    res.send(req.locals.user); 
});

module.exports = {
    usersController: router
}