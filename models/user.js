require('dotenv').config();
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;


// NEED TO MODIFY FOR CONSISTANCY IN DATABASE
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30
  },
  firstname: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30
  },
  lastname: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
    minlength: 5,
    maxlength: 50
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }
}, { timestamps: true });

// Generate Token
userSchema.methods.generateAuthToken = function () {
  const payload = { _id: this._id, isAdmin: this.isAdmin }
  const token = jwt.sign(payload, jwtPrivateKey, {expiresIn: '7d'});
  return token;
}

// creating User model
const User = mongoose.model('User', userSchema)

// validating user 
function validateUser(user) {

  const schema = Joi.object({
    firstname: Joi.string().trim().min(3).max(30).required().lowercase(),
    lastname: Joi.string().trim().min(3).max(30).required().lowercase(),
    email: Joi.string().required().email().trim().min(5).max(50).lowercase(),
    password: Joi.string().required().min(6).max(20),
  });

  return schema.validate(user);
}

module.exports.validate = validateUser;
module.exports.User = User