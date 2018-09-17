const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/e-com-backend',{useNewUrlParser: true})
.then(() => {
    console.log('connected to db'); 
})
.catch((err) => {
    res.send(err);
})
mongoose.set('useCreateIndex', true);

module.exports = { mongoose }