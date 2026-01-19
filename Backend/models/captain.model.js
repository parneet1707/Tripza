const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const captainSchema = new mongoose.Schema({
        fullname:{
             firstname: {type: String, required: true},
                lastname: {type: String, required: true}
        },
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true,select: false},
        socketId: {type: String},
        status: {type: String, enum: ['available', 'unavailable'], default: 'unavaila'},
        vehicle:{
             color:{
                type: String, required: true
             },
             plate:{
                type: String, required: true
             },
             capacity:{
                type: Number, required: true,min:[1,'capacity must be at least 1'],

             },
             vehicleType:{
                type: String, required: true,enum:['car','bike','van','truck']
             }
        },
        location:{
              lat:{
                 type: Number, required: false
              },
              long:{
                    type: Number, required: false
              }
        }

})


captainSchema.methods.generateAuthToken = function() {
  
  
  
    const token = jwt.sign({i_id: this._id, email: this.email}, process.env.JWT_SECRET, {expiresIn: '1h'})
    return token;
}
 captainSchema.methods.comarePassword = async function(password) {
    return bcrypt.compare(password, this.password);
 }

captainSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);

}

module.exports = mongoose.model("Captain", captainSchema);

