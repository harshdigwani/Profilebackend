const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  about: {
    type: new mongoose.Schema({
      username: {
        type: String,
        unique: true,
        minlength: 3,
        maxlength: 30,
        required: true,
        trim: true,
        lowercase: true
      },
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true,
        lowercase: true
      },
      email: {
        type: String,
        unique: true,
        minlength: 5,
        maxlength: 50,
        required: true,
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        minlength: 10,
        maxlength: 13
      },
      description: {
        type: String,
        maxlength: 1000
      }
    }),
    required: true
  },

  experiance: [{
    jobTitle: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: {
      type: String,
      maxlength: 1000
    }
  }],

  education: [{
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  }],

  skils: [{
    type: String,
    maxlength: 100
  }],

  projects: [{
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 255
      }
    })
  }],

  blogs: [{
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 255
      }
    })
  }],

  links: [{
    type: String,
    minlength: 5,
    maxlength: 255
  }],
  achievements: [{ type: String, maxlength: 1000 }],
  extras: [{ type: String, maxlength: 1000 }]



}, { timestamps: true })

const Profile = mongoose.model('Profile', profileSchema);

// validating profile of user should be before mongoose object creation
function validateProfile(profile) {

  const schema = Joi.object({

    about: Joi.object({
      username: Joi.string().required().min(3).max(30).trim(),
      name: Joi.string().required().min(5).max(50).trim(),
      email: Joi.string().required().min(5).max(50).trim(),
      phone: Joi.string().min(10).max(13).trim(),
      description: Joi.string().max(1000).trim()
    }),

    experiance: Joi.array().items({
      jobTitle: Joi.string().min(3).max(100).required().trim(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      description: Joi.string().max(1000)
    }),

    education: Joi.array().items({
      title: Joi.string().min(3).max(100).required().trim(),
      score: Joi.number().min(0).max(100).positive().precision(2),
      startDate: Joi.date().required(),
      endDate: Joi.date().required()
    }),
    
    skils: Joi.array().items(Joi.string().max(100)),

    projects:  Joi.array().items(Joi.object({
      title: Joi.string().min(3).max(255).required().trim()
    })),

    blogs:  Joi.array().items(Joi.object({
      title: Joi.string().min(3).max(255).required().trim()
    })),

    links: Joi.array().items(Joi.string().min(5).max(255)),

    achievements: Joi.array().items(Joi.string().max(1000)),

    extras: Joi.array().items(Joi.string().max(1000)),
  });

  return schema.validate(profile);
}

module.exports.Profile = Profile;
module.exports.validate = validateProfile;