const mongoose = require("mongoose");
const passportlocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
UserSchema.plugin(passportlocalMongoose);

module.exports = mongoose.model("User", UserSchema);
