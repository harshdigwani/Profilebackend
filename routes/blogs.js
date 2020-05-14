const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Blog, validate } = require('../models/blogs');
const { Category } = require('../models/category');
const { User } = require('../models/user');
const { Profile } = require('../models/profile');
const auth = require('../middleware/auth');


router.get('/all', async (req, res, next) => {

  try {
    let result = await Blog.find();
    if (!result) return res.status(404).send("No Blogs found...");
    res.status(200).send(result)
  }
  catch (err) {
    next(err);
  }
})

router.get('/:id', async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid id");

  try {
    let result = await Blog.findById(id);
    if (!result) return res.status(404).send("No Blog found with given id...");
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})


router.get('/user/:id', async (req, res, next) => {

  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid id");

  try {
    let result = await Blog.find({
      "author._id": userId
    });
    if (!result) return res.status(404).send("No Blogs found with given user");
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})


router.post('/', auth, async (req, res, next) => {


  const userId = req.user._id; // get from auth token

  let blog = {
    title: req.body.title,
    category: req.body.category, // objectId 
    author: req.body.author,     // objectId 
    links: req.body.links,
    content: req.body.content
  }

  // verify blog object
  const { error } = validate(blog);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    blog.category = await Category.findById(blog.category).select({ "name": 1 });
    if (!blog.category) return res.status(400).send("Invalid category");
    blog.author = await User.findById(userId).select({ "firstname": 1, "lastname": 1 });
    if (!blog.author) return res.status(400).send("Invalid User");

    //creating custom name by appending firstname and lastname
    blog.author = {
      _id: blog.author._id,
      name: blog.author.firstname + ' ' + blog.author.lastname
    }
    blog = new Blog(blog);
    blog = await blog.save();

    // Updating Profile
    let profile = await Profile.findOne({ "about._id": userId });
    profile.blogs.push({
      _id: blog._id,
      title: blog.title
    });
    profile = await profile.save()

    res.status(200).send(blog);

  }
  catch (err) {
    next(err);
  }

})


router.put('/:id', auth, async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid id");

  // verify Blog object
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userId = req.user._id; // get from auth token

  try {
    let blog = await Blog.findById(id);
    if (!blog) return res.status(404).send("No Blog found with given id");
    if (blog.author._id != userId) return res.status(401).send("Unauthorised User");

    blog.title = req.body.title ? req.body.title : blog.title;
    blog.links = req.body.links ? req.body.links : blog.links;
    blog.description = req.body.description ? req.body.description : blog.description;

    blog = await blog.save();
    res.status(200).send(blog);
  }
  catch (err) {
    next(err);
  }
})

router.delete('/:id', auth, async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid id");

  const userId = req.user._id; // get from auth token

  try {
    let result = await Blog.findOneAndDelete({ _id: id, "author._id": userId });
    if (!result) return res.status(404).send("No Blog found with given id to delete");
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})

module.exports = router