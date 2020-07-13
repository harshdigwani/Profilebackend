const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({

  title: {
    type: String,
    trim: true,
    required: true,
    minlength: 10,
    maxlength: 100
  },

  category: {
    type: new mongoose.Schema({
      name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 100,
      }
    }),
    required: true
  },

  createdBy: {
    type: new mongoose.Schema({
      name: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 50,
      }
    }),
    required: true
  },

  links: [{
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 255
  }],

  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    required: true
  }
}, { timestamps: true }
)

const Project = mongoose.model('Project', projectSchema);

//validate blog and user id
function validateProject(project) {

  const schema = Joi.object({
    title: Joi.string().trim().min(10).max(100).required(),
    category: Joi.objectId().trim().required(),
    createdBy: Joi.objectId().trim().required(),
    links: Joi.array().items(Joi.string().min(5).max(255)),
    description: Joi.string().trim().min(10).max(1000).required()
  });

  return schema.validate(project);
}

module.exports.Project = Project;
module.exports.validate = validateProject;