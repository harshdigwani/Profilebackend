const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Project, validate } = require('../models/project');
const { Category } = require('../models/category');
const { User } = require('../models/user');
const { Profile } = require('../models/profile');
const auth = require('../middleware/auth');

router.get('/all', async (req, res, next) => {

  try {
    let result = await Project.find();
    if (!result) return res.status(404).send("No projects found...");
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
    let result = await Project.findById(id);
    if (!result) return res.status(404).send("No project found with given id...");
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})


router.get('/user/:id', async (req, res, next) => {

  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid user id");

  try {
    let result = await Project.find({
      "createdBy._id": userId
    });
    if (!result) return res.status(404).send("No project found with given user");
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})


router.post('/', auth, async (req, res, next) => {
  // verify project object

  const userId = req.user._id; // get from auth token

  let project = {
    title: req.body.title,
    category: req.body.category,
    createdBy: req.body.createdBy,
    links: req.body.links,
    description: req.body.description
  }

  const { error } = validate(project);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    project.category = await Category.findById(project.category).select({ "name": 1 });
    if (!project.category) return res.status(400).send("Invalid category");
    project.createdBy = await User.findById(userId).select({ "firstname": 1, "lastname": 1 });
    if (!project.createdBy) return res.status(400).send("Invalid User");

    //creating custom name by appending firstname and lastname
    project.createdBy = {
      _id: project.createdBy._id,
      name: project.createdBy.firstname + " " + project.createdBy.lastname
    };

    project = new Project(project);
    project = await project.save();

    // Updating Profile
    let profile = await Profile.findOne({ "about._id": userId });
    if (!profile) res.status(404).send("No Profile found with given user");
    profile.projects.push({
      _id: project._id,
      title: project.title
    });
    profile = await profile.save()

    res.status(200).send(project);

  } 
  catch (err) {
    next(err);
  }

})

router.put('/:id', auth, async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid id");

  const userId = req.user._id; // get from auth token

  try {
    let project = await Project.findById(id);
    if (!project) res.status(404).send("No Project found with given id");
    if (project.createdBy._id != userId) return res.status(401).send("Unauthorised User");

    project.title = req.body.title ? req.body.title : project.title;
    project.links = req.body.links ? req.body.links : project.links;
    project.description = req.body.description ? req.body.description : project.description

    project = await project.save();
    res.status(200).send(project);
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
    let result = await Project.findOneAndDelete({ _id: id, "createdBy._id": userId });
    if (!result) res.status(404).send("No Project found with given user");
    res.status(200).send(result);
  }
  catch (err) {
    next(err);
  }
})

module.exports = router