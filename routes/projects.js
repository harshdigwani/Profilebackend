const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Project, validate } = require('../models/project');
const { Category } = require('../models/category');
const { User } = require('../models/user');
const { Profile } = require('../models/profile');
const auth = require('../middleware/auth');

//Get all projects
router.get('/all', async (req, res, next) => {

  try {
    let result = await Project.find();
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No projects found..."
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Projects found successfully...",
      "data": result
    })
  }
  catch (err) {
    next(err);
  }
})


// get project by id
router.get('/:id', async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid id"
  });
  try {
    let result = await Project.findById(id);
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No project found with given id..."
    });

    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Project found with given id...",
      "data": result
    });
  }
  catch (err) {
    next(err);
  }
})

//get projects of user
router.get('/user/:id', async (req, res, next) => {

  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid user id"
  });

  try {
    let result = await Project.find({
      "createdBy._id": userId
    });
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No project found with given user"
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Project found successfully...",
      "data": result
    });
  }
  catch (err) {
    next(err);
  }
})


// Add project
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
  if (error) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": error.details[0].message
  });

  try {
    project.category = await Category.findById(project.category).select({ "name": 1 });
    if (!project.category) return res.status(400).json({
      "status": 400,
      "ok": false,
      "message": "Invalid category"
    });
    project.createdBy = await User.findById(userId).select({ "firstname": 1, "lastname": 1 });
    if (!project.createdBy) return res.status(400).json({
      "status": 400,
      "ok": false,
      "message": "Invalid User"
    });

    //creating custom name by appending firstname and lastname
    project.createdBy = {
      _id: project.createdBy._id,
      name: project.createdBy.firstname + " " + project.createdBy.lastname
    };

    project = new Project(project);
    project = await project.save();

    // Updating Profile
    let profile = await Profile.findOne({ "about._id": userId });
    if (!profile) res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Project found with given user"
    });
    profile.projects.push({
      _id: project._id,
      title: project.title
    });
    profile = await profile.save()

    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Project added successfully...",
      "data": project
    });

  }
  catch (err) {
    next(err);
  }

})


// Update project
router.put('/:id', auth, async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid id"
  });

  const userId = req.user._id; // get from auth token

  try {
    let project = await Project.findById(id);
    if (!project) res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Project found with given id"
    });
    if (project.createdBy._id != userId) return res.status(401).json({
      "status": 401,
      "ok": false,
      "message": "Unauthorised User"
    });

    project.title = req.body.title ? req.body.title : project.title;
    project.links = req.body.links ? req.body.links : project.links;
    project.description = req.body.description ? req.body.description : project.description

    project = await project.save();
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "project found with given user",
      "data": project
    });
  }
  catch (err) {
    next(err);
  }
})

router.delete('/:id', auth, async (req, res, next) => {

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid id"
  });

  const userId = req.user._id; // get from auth token

  try {
    let result = await Project.findOneAndDelete({ _id: id, "createdBy._id": userId });
    if (!result) res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No project found with given user"
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Project deleted Succussfully...",
      "data": result
    });
  }
  catch (err) {
    next(err);
  }
})

module.exports = router