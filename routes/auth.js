const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const _ = require('lodash');

router.get('/signout', (req, res) => {
  // res.clearCookie('x-auth-token');
  res.status(200).send({ "message": "Signing Out..." }).flushHeaders();
})

router.post('', async (req, res, next) => {

  try {

    const { error } = validate(req.body);
    if (error) return res.status(400).send({ "error": error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ "error": 'Invalid email or password.' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ "error": 'Invalid email or password.' });

    const token = user.generateAuthToken();
    //put token in cookie for 60min = 60 (min) * 60(sec) * 1000(miliseconds)
    res.cookie("token", token, { httpOnly:true, maxAge: 60*60*1000 });
    //put token in headers also
    res.status(200).header('x-auth-token', token).json(
      {
        "token": token,
        "user": _.pick(user, ['_id', 'username', 'firstname', 'lastname', 'email'])
      });
  }
  catch (err) {
    next(err);
  }
});

function validate(login) {
  const schema = Joi.object({
    email: Joi.string().required().email().trim().min(5).max(50).lowercase(),
    password: Joi.string().required().min(6).max(20),
  });
  return schema.validate(login);
}

module.exports = router; 
