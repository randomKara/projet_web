const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Email is not valid !!!"],
    unique: true,
    lowercase: true,
  },
  password:{
    type:String,
    minlength:8,
    required:true
  },
  confirm_Password:{
    type:String,
    minlength:8,
    required:true,
    validate:{
      validator:function(cPass){
        return this.password === cPass
      },message:"password does not match !!!"
    }
  },
  created_at:{
    type:Date,
    default:Date.now()
  },
  last_pass_update:{
    type:Date,
    default:Date.now()
  },
});

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  
  this.confirm_Password = undefined;
  next();
});

userSchema.methods.verifyPassword = async function(password, userPassword){
  return await bcrypt.compare(password, userPassword);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
