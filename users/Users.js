const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    }
});

userSchema.pre('save', function(req, res, next) {
    bcrypt.hash(this.password, 10).then(hash => {
        this.password = hash;
        return next();
    }).catch(err => res.send(err));
});

userSchema.methods.verifyPassword = function(guess, callback) {
    bcrypt.compare(guess, this.password, function(err, isValid) {
        if (err) return callback(err);

        callback(null, isValid);
    })
}
module.exports = mongoose.model('User', userSchema, 'user');
