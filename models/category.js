const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
  const schema = Joi.object({
    category: Joi.string().required().trim().minlength(3).maxlength(100)
  })

  return schema.validate(category);
}


module.exports.Category = Category;
module.exports.validate = validateCategory;