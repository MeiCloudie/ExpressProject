module.exports = function (...roles) {
  return function (req, res, next) {
    let requireRoles = roles.map((e) => e.toLowerCase())
    let userRoles = req.user.role.map((e) => e.toLowerCase()) //["ADMIN", "MODIFIER"]
    let result = requireRoles.filter((e) => userRoles.includes(e))
    if (result.length > 0) {
      next()
    } else {
      res.status(403).send("ban ko co quyen")
    }
    console.log(result)
  }
}
