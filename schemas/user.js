var mongoose = require("mongoose")
var bcrypt = require("bcrypt")

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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)
//Khong su dung Arrow Function vi phai su dung tu khoa THIS
userSchema.pre("save", function () {
  // if(this.isModified("pass"))
  this.password = bcrypt.hashSync(this.password, 10)
})

module.exports = new mongoose.model("user", userSchema)
