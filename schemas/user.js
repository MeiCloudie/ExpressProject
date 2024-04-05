var mongoose = require("mongoose")
var bcrypt = require("bcrypt")
var crypto = require("crypto")

var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    status: {
      type: Boolean,
      require: true,
      default: true,
    },
    role: {
      type: [String],
      require: true,
    },
    tokenResetPassword: String,
    tokenResetPasswordExp: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)
//Khong su dung Arrow Function vi phai su dung tu khoa THIS
userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10)
  }
})

userSchema.methods.genJWT = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.JWT_SECRETKEY,
    { expiresIn: config.JWT_EXP }
  )
}

module.exports = new mongoose.model("user", userSchema)
