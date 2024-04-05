var jwt = require("jsonwebtoken")
var userModel = require("../schemas/user")

module.exports = async function (req, res, next) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    res.status(404).send("vui long dang nhap")
  } else {
    token = req.headers.authorization.split(" ")[1]
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
