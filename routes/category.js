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
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Categories found"
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Categories found successfully...",
      "data": result
    });
  }
  catch (err) {
    next(err);
  }
})


//get category by id
router.get('/:id', async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid Id"
  });

  try {
    let result = await Category.findById(req.params.id);
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Category found with given user"
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Category found with given id...",
      "data": result
    });
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
  if (error) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": error.details[0].message
  });

  try {
    //check for category
    let result = await Category.find(category);
    if (!result) return res.status(400).json({
      "status": 400,
      "ok": false,
      "message": "Category already exist"
    });

    // creating category
    category = new Category(category)
    result = await category.save();
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Category created Successfully...",
      "data": result
    })
  }
  catch (err) {
    next(err);
  }

})

// Update Category
router.put('/:id', [auth, admin], async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid id"
  });

  // verify Category object
  const { error } = validate(req.body);
  if (error) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": error.details[0].message
  });

  try {
    console.log(req.body.name + "================");
    let result = await Category.find({ name: req.body.name });
    console.log(result);
    if (!result) return res.status(400).json({
      "status": 400,
      "ok": false,
      "message": "Category already exist"
    });

    result = await Category.findByIdAndUpdate(req.params.id, {
      $set: { name: req.body.name }
    }, { new: true });
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No category found with given id"
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Category Updated Successfully...",
      "data": result
    })
  }
  catch (err) {
    next(err);
  }

})

router.delete('/:id', [auth, admin], async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid id"
  });

  try {
    let result = await Category.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No category found with given id"
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Category deleted successfully...",
      "data": result
    });
  }
  catch (err) {
    next(err);
  }
})

module.exports = router