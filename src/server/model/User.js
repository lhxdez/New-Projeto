let mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  login: { type: String, required: true  },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema, 'User');
