const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Blog, validate } = require('../models/blogs');
const { Category } = require('../models/category');
const { User } = require('../models/user');
const { Profile } = require('../models/profile');
const auth = require('../middleware/auth');

// Get All Blogs
router.get('/all', async (req, res, next) => {

  try {
    let result = await Blog.find();
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Blogs found..."
    });

    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Blogs Found Successfully...",
      "data": result
    })
  }
  catch (err) {
    next(err);
  }
})

// Get Blog by id
router.get('/:id', async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid id"
  });

  try {
    let result = await Blog.findById(id);
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Blog found with given id..."
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Blog found successfully with given id...",
      "data": result
    });
  }
  catch (err) {
    next(err);
  }
})


// Get blogs of a user
router.get('/user/:id', async (req, res, next) => {

  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid id"
  });

  try {
    let result = await Blog.find({
      "author._id": userId
    });
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Blogs found with given user"
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Blog found with given user",
      "data": result
    });
  }
  catch (err) {
    next(err);
  }
})


// Add blog or post blog
router.post('', auth, async (req, res, next) => {


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
  if (error) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": error.details[0].message
  });

  try {
    blog.category = await Category.findById(blog.category).select({ "name": 1 });
    if (!blog.category) return res.status(400).json({
      "status": 400,
      "ok": false,
      "message": "Invalid category"
    });

    blog.author = await User.findById(userId).select({ "firstname": 1, "lastname": 1 });
    if (!blog.author) return res.status(400).json({
      "status": 400,
      "ok": false,
      "message": "Invalid User"
    });

    //creating custom name by appending firstname and lastname
    blog.author = {
      _id: blog.author._id,
      name: blog.author.firstname + ' ' + blog.author.lastname
    }
    blog = new Blog(blog);
    blog = await blog.save();

    // Adding Blog
    let profile = await Profile.findOne({ "_id": userId });

    profile.blogs.push({
      _id: blog._id,
      title: blog.title
    });
    profile = await profile.save()

    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Blog Created Successfully",
      "data": blog
    });

  }
  catch (err) {
    next(err);
  }

})

// Adding blog 
router.put('/:id', auth, async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid id"
  });

  // verify Blog object
  const { error } = validate(req.body);
  if (error) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": error.details[0].message
  });

  const userId = req.user._id; // get from auth token

  try {
    let blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Blog found with given id"
    });
    if (blog.author._id != userId) return res.status(401).json({
      "status": 401,
      "ok": false,
      "message": "Unauthorised User"
    });

    blog.title = req.body.title ? req.body.title : blog.title;
    blog.links = req.body.links ? req.body.links : blog.links;
    blog.content = req.body.content ? req.body.content : blog.content;

    blog = await blog.save();
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Blog Updated Successfully...",
      "data": blog
    });
  }
  catch (err) {
    next(err);
  }
})


// Delete Blog
router.delete('/:id', auth, async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid id"
  });

  const userId = req.user._id; // get from auth token

  try {
    let result = await Blog.findOneAndDelete({ _id: id, "author._id": userId });
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Blog found with given id to delete"
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Blog Deleted Successfully...",
      "data": result
    });
  }
  catch (err) {
    next(err);
  }
})

module.exports = router