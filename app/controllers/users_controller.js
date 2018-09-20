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
}) 

router.post('/', (req, res) => {
    let body = _.pick(req.body, ['username', 'email', 'password','role']);
    let user = new User(body);
    user.save().then((user) => {
        return user.generateToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.send(err); 
    });
});

router.get('/profile', authenticateUser, (req, res) => {
    res.send(req.locals.user); 
});

module.exports = {
    usersController: router
}