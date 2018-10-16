const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const _ = require('lodash');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { cartItemSchema } = require('./cart_item');

const userSchema = new Schema({
    username: {
        type: String, 
        required: true
    }, 
    password: {
        type: String, 
        required: true, 
        minlength: 8,
        maxlength: 128
    }, 
    email: {
        type: String, 
        required: true, 
        validate: {
            validator: function(value){
                return validator.isEmail(value);
            },
            message: function(){
                return 'invalid email format';
            }
        }
    },
    role: {
        type: String,
        enum: ['admin','customer']
    },
    tokens: [
        {
            auth: {
                type: String,
                default: 'x-head'
            },
            token: {
                type: String
            }
        }
    ],
    cartItems: [ cartItemSchema ],
    wishlists: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            isPublic: {
                type: Boolean,
                enum: [ true, false ],
                default: false
            }
        }
    ]
});

userSchema.pre('save',function(next) {
    let user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10)
        .then((salt) => {
            bcrypt.hash(user.password,salt)
            .then((hashedPassword) => {
                user.password = hashedPassword;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.statics.findByToken = function(token) {
    let User = this;
    let tokenData;
    try {
        tokenData = jwt.verify(token, 'supersecret')
    } catch(e) {
        return Promise.reject(e);
    }
    return User.findOne({ '_id': tokenData._id, 'tokens.token': token })
}

userSchema.statics.findByEmailAndPassword = function(email, password) {
    let User = this;
    return User.findOne({email: email})
    .then((user) => {
        if(!user) {
            return Promise.reject('invalid email');
        } 
        return bcrypt.compare(password, user.password)
        .then((res) => {
            if(res) {
                return user;
            } else {
                return Promise.reject('invalid password');
            }
        })
    })
}

userSchema.methods.toJSON = function() {
    return _.pick(this, ['_id','username','email','role']);
}

userSchema.methods.generateToken = function() {
    let tokenData = {
        _id: this._id
    };
    
    let generatedTokenInfo = {
        access: 'auth',
        token: jwt.sign(tokenData, 'supersecret')
    }

    this.tokens.push(generatedTokenInfo);
    return this.save().then((user) => {
        return generatedTokenInfo.token;
    });
}

userSchema.methods.deleteToken = function(userToken) {
    let user = this;
    let findToken = user.tokens.find((token) => {
        return token.token == userToken;
    });
    user.tokens.remove(findToken._id);
    return user.save();
}

const User = mongoose.model('User',userSchema);

module.exports = {
    User
}