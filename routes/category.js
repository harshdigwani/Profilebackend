const _ = require('lodash');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Category, validate } = require('../models/category');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// get all categories
router.get('/all', async (req, res, next) => {
  
  try {
    let result = await Category.find();
    if (!result) return res.status(404).send({ "error": "No Categories found" });
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})


//get category by id
router.get('/:id', async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ "error": "Invalid Id" });

  try {
    let result = await Category.findById(req.params.id);
    if (!result) return res.status(404).send({ "error": "No Category found with given user" });
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})


//Adding category into database
router.post('', [auth, admin], async (req, res, next) => {

  let category = {
    name: req.body.name
  }

  const { error } = validate(category);
  if (error) return res.status(400).send({ "error": error.details[0].message });

  try {
    category = new Category(category)
    let result = await category.save();
    res.status(200).send(result)
  }
  catch (err) {
    next(err);
  }

})

// Update Category
router.put('/:id', [auth, admin], async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ "error": "Invalid id" });

  // verify Category object
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ "error": error.details[0].message });

  try {
    let result = await Category.findByIdAndUpdate(req.params.id, {
      $set: { name: req.body.name }
    }, { new: true });
    if (!result) return res.status(404).send({ "error": "No category found with given id" });
    res.status(200).send(result)
  }
  catch (err) {
    next(err);
  }

})

router.delete('/:id', [auth, admin], async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ "error": "Invalid id" });

  try {
    let result = await Category.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ "error": "No category found with given id" });
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})

module.exports = router