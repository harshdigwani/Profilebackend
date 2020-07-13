const express = require('express');
const router = express.Router();
const hashPassword = require('../middleware/hash');
const mongoose = require('mongoose');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const { Profile } = require('../models/profile');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/all', [auth, admin], async (req, res, next) => {

  // get all users
  try {
    let users = await User.find().select({ username: 1, firstname: 1, lastname: 1, email: 1 })
    if (!users) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No users found"
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Users Found Successfully...",
      "data": users
    })
  }
  catch (err) {
    next(err);
  }

})


router.get('/me', auth, async (req, res, next) => {

  const userId = req.user._id;
  try {
    let user = await User.findById(userId).select({ username: 1, firstname: 1, lastname: 1, email: 1 })
    if (!user) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No User found with given user"
    });
    
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "User Found successfully...",
      "data": user
    });
  }
  catch (err) {
    next(err);
  }
})


router.post('/signup', async (req, res, next) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": error.details[0].message
  });

  try {
    // check for existing user
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({
      "status": 400,
      "ok": false,
      "message": "User already registered"
    });

    // encrypt password and reasign to user.password
    req.body.password = await hashPassword(req.body.password);

    // creating user
    let uname = req.body.email;
    uname = uname.substr(0, uname.indexOf('@')) + Math.floor(Math.random() * 1000000);
    user = new User({
      username: uname,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    });
    user = await user.save()

    // Creating profile ref to current user
    profile = new Profile({
      _id: user._id,
      about: {
        username: user.username,
        name: user.firstname + " " + user.lastname,
        email: user.email
      }
    });
    profile = await profile.save()

    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "User Created Successfully...",
      "data": _.pick(user, ['_id', 'username', 'firstname', 'lastname', 'email'])
    })

  }
  catch (err) {
    next(err);
  }

})

module.exports = router