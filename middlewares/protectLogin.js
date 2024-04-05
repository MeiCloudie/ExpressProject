var jwt = require("jsonwebtoken")
var userModel = require("../schemas/user")

module.exports = async function (req, res, next) {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  } else {
    if (req.cookies.token) {
      token = req.cookies.token
    } else {
      res.status(404).send("vui long dang nhap")
    }

    if (!token) {
      res.status(404).send("vui long dang nhap")
    }

    try {
      let info = jwt.verify(token, "NNPTUD_S6")
      if (info.exp * 1000 > Date.now()) {
        let id = info.id
        let user = await userModel.findById(id)
        req.user = user
        next()
      } else {
        res.status(404).send("vui long dang nhap")
      }
    } catch (error) {
      res.status(404).send("vui long dang nhap")
    }
  }
}
