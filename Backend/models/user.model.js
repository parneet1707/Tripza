const mongoose = require('mongoose'); // Fixed spelling
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: { type: String, required: true, minlength: [3, "Firstname must be at least 3 characters long"] },
        lastname: { type: String, required: true, minlength: [3, "Lastname must be at least 2 characters long"] }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: [6, "Password must be at least 6 characters long"], select: false },
    socketId: { type: String, default: "" }, // Fixed typo 'sockedId' to 'socketId'
});

userSchema.methods.generateAuthToken = function() {
    const token = jsonWebToken.sign(
        { _id: this._id, email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Set token to expire in 24 hours
    );
    return token;
}
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

// Fixed this to be a STATIC method


const userModel = mongoose.model('User', userSchema);
module.exports = userModel;