const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

  title: {
    type: String,
    trim: true,
    required: true,
    minlength: 10,
    maxlength: 255
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

  author: {
    type: new mongoose.Schema({
      name: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 50
      }
    }),
    required: true
  },

  links:
    [{
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 255,
    }],

  content: {
    type: String,
    trim: true,
    maxlength: 10000,
    required: function () { return (!this.links) ? true : false }
  }

}, { timestamps: true }
)

const Blog = mongoose.model('Blog', blogSchema);

//validate blog and user id
function validateBlog(blog) {

  const schema = Joi.object({
    title: Joi.string().trim().min(5).max(255).required(),
    category: Joi.objectId().trim().required(),
    author: Joi.objectId().trim().required(),
    links: Joi.array().items(Joi.string().min(5).max(255)),
    content: Joi.string().trim().min(10).max(10000).required()
  });

  return schema.validate(blog);
}

module.exports.Blog = Blog;
module.exports.validate = validateBlog;