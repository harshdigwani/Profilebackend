const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User } = require('../models/user');
const { Profile, validate } = require('../models/profile');
const auth = require('../middleware/auth');

// get all profiles
router.get('/all', async (req, res, next) => {

  try {
    let result = await Profile.find();
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Profiles found"
    });

    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Profiles found successfully...",
      "data": result
    })

  }
  catch (err) {
    next(err);
  }

})


// get my profile
router.get('/me', auth, async (req, res, next) => {

  const userId = req.user._id;
  try {
    let result = await Profile.findById(userId);
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Profile found with given id..."
    });
    
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "Profile found successfully with given user",
      "data": result
    })
  }
  catch (err) {
    next(err);
  }

})


// Get Profile by id
router.get('/:id', async (req, res, next) => {
  // get profile of a user with profileId
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid id"
  });
  try {
    let result = await Profile.findById(req.params.id);
    if (!result) return res.status(404).json({
      "status": 404,
      "ok": false,
      "message": "No Profile found with given id..."
    });
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "No project found with given user",
      "data": result
    })

  }
  catch (err) {
    next(err);
  }
})


// Update Profile
router.put('/me', auth, async (req, res, next) => {

  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": "Invalid id"
  });

  // verify Profile object
  const { error } = validate(req.body);
  if (error) return res.status(400).json({
    "status": 400,
    "ok": false,
    "message": error.details[0].message
  });

  try {
    let profile = await Profile.findById(userId);

    if (profile._id != userId) return res.status(403).json({
      "status": 403,
      "ok": false,
      "message": "Unauthorised user"
    });

    if (req.body.about) {
      profile.about.phone = req.body.about.phone ? req.body.about.phone : profile.about.phone;
      profile.about.description = req.body.about.description ? req.body.about.description : profile.about.description;
    }
    profile.experiance = req.body.experiance ? req.body.experiance : profile.experiance;
    profile.education = req.body.education ? req.body.education : profile.education;
    profile.skills = req.body.skills ? req.body.skills : profile.skills;
    profile.links = req.body.links ? req.body.links : profile.links;
    profile.achievements = req.body.achievements ? req.body.achievements : profile.achievements;
    profile.extras = req.body.extras ? req.body.extras : profile.extras;
    // profile.projects = req.projects;
    // profile.blogs = req.blogs;

    let result = await profile.save()
    res.status(200).json({
      "status": 200,
      "ok": true,
      "message": "No project found with given user",
      "data": result
    })

  }
  catch (err) {
    next(err);
  }
})

module.exports = router