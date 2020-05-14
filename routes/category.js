const _ = require('lodash');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Category, validate } = require('../models/category');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/all', async (req, res, next) => {
  // get all profiles
  try {
    let result = await Category.find();
    if (!result) return res.status(404).send("No Categories found");
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})

router.get('/:id', async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid Id");

  try {
    let result = await Category.findById(req.params.id);
    if (!result) return res.status(404).send("No Category found with given user");
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})

router.post('/', [auth, admin], async (req, res, next) => {

  let category = {
    name: req.body.name
  }

  const { error } = validate(category);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    category = new Category(category)
    let result = await category.save();
    res.status(200).send(result)
  }
  catch (err) {
    next(err);
  }

})

router.put('/:id', [auth, admin], async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid id");

  // verify Category object
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let result = await Category.findByIdAndUpdate(req.params.id, {
      $set: { name: req.body.name }
    }, { new: true });
    if (!result) return res.status(404).send("No category found with given id");
    res.status(200).send(result)
  }
  catch (err) {
    next(err);
  }

})

router.delete('/:id', [auth, admin], async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid id");

  try {
    let result = await Category.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send("No category found with given id");
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})

module.exports = router