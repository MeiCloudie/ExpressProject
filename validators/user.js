var { check } = require("express-validator")
var util = require("util")

let options = {
  password: {
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 1,
  },
  username: {
    max: 40,
    min: 8,
  },
}

let notifies = {
  NOTI_USERNAME: "username phai dai tu %d ki tu den %d ki tu",
  NOTI_PASSWORD:
    "password phai dai toi thieu %d ki tu, trong do co it nhat %d ki tu so, %d ki tu thuong, %d ki tu hoa",
  //TODO: Lam them
}

module.exports = function () {
  return [
    check("email", "email phai dung dinh dang").isEmail,
    check(
      "password",
      util.format(
        notifies.NOTI_PASSWORD,
        options.password.minSymbols,
        options.password.minNumbers,
        options.password.minLowercase,
        options.password.minUppercase
      )
    ).isStrongPassword(options.password),
    check("role", "role phai dung dinh dang").isIn(["USER", "ADMIN", "MOD"]),
    check(
      "username",
      util.format(
        notifies.NOTI_USERNAME,
        options.username.min,
        options.username.max
      )
    ).isLength(options.username),
  ]
}
