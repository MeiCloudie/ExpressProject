var { check } = require("express-validator")

let notifies = {
  NOTI_EMAIL: "email phai dung dinh dang",
}

module.exports = function () {
  return [check("email", notifies.NOTI_EMAIL).isEmail()]
}
