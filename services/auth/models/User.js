const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletBalance: { type: Number, default: 500 }
});

module.exports = mongoose.model('User', userSchema);
