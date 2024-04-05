var express = require("express")
var router = express.Router()
// var bcrypt = require("bcrypt")
var userModel = require("../schemas/user.js")
var checkValid = require("../validators/user.js")
var { validationResult } = require("express-validator")
var protect = require("../middlewares/protectLogin")

router.get(
  "/",
  protect,
  function (req, res, next) {
    let requireRoles = ["ADMIN", "MODIFIER"].map((e) => e.toLowerCase())
    let userRoles = req.user.role.map((e) => e.toLowerCase()) //["ADMIN", "MODIFIER"]

    //sử dụng các hàm built in của mảng để tìm phần tử chung của 2 mảng
    //requireRoles userRoles
    //KHÔNG PHÂN BIỆT HOA THƯỜNG
    //dùng some hoặc filter
    let result = requireRoles.filter((e) => userRoles.includes(e))
    if (result.length > 0) {
      next()
    } else {
      res.status(403).send("ban ko co quyen")
    }
    console.log(result)
  },
  async function (req, res, next) {
    let users = await userModel.find({}).exec()
    res.status(200).send(users)
  }
)

router.get("/:id", async function (req, res, next) {
  try {
    let user = await userModel.findById(req.params.id).exec()
    res.status(200).send(user)
  } catch (error) {
    res.status(404).send(error)
  }
})

router.post("/add", checkValid(), async function (req, res, next) {
  var result = validationResult(req)
  if (result.errors.length > 0) {
    res.status(404).send(result.errors)
    return
  }

  try {
    // var newPass = await bcrypt.hash(req.body.password, 10)
    // var newPass = bcrypt.hashSync(req.body.password, 10)
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      // password: newPass,
      email: req.body.email,
      status: req.body.status,
      role: req.body.role,
    })
    await newUser.save()
    res.status(200).send({
      success: true,
      data: newUser,
    })
  } catch (error) {
    res.status(404).send({
      success: false,
      data: error,
    })
  }
})

router.put("/edit/:id", async function (req, res, next) {
  try {
    var user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.status(200).send(user)
  } catch (error) {
    res.status(404).send(error)
  }
})

router.delete("/del/:id", async function (req, res, next) {
  try {
    var user = await userModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
      }
    )

    res.status(200).send(user)
  } catch (error) {
    res.status(404).send(error)
  }
})

module.exports = router
