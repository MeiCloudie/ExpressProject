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
  NOTI_PASSWORD:
    "password phai dai toi thieu %d ki tu, trong do co it nhat %d ki tu so, %d ki tu thuong, %d ki tu in hoa, %d ki tu dac biet",
}

module.exports = function () {
  return [
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
  ]
}
