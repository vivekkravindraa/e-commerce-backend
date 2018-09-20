const { ObjectID } = require('mongodb');

// function expression
const validateId = function (req, res, next) {
    // console.log('im inside the middleware');
    if (!ObjectID.isValid(req.params.id)) {
        res.send({
            notice: 'invalid object id'
        })
    } else {
        next();
    }
};

module.exports = {
    validateId
}