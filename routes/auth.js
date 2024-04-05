var express = require("express")
var router = express.Router()
var bcrypt = require("bcrypt")
var userModel = require("../schemas/user.js")
var checkValidAuth = require("../validators/auth.js")
var { validationResult } = require("express-validator")
var jwt = require("jsonwebtoken")
var protect = require("../middlewares/protectLogin")

router.post("/register", checkValidAuth(), async function (req, res, next) {
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
      role: ["USER"],
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

router.post("/login", async function (req, res, next) {
  let password = req.body.password
  let username = req.body.username

  if (!password || !username) {
    res.status(404).send({
      success: false,
      data: "username va password khong duoc de trong",
    })
    return
  }

  var user = await userModel.findOne({ username: username })
  if (!user) {
    res.status(404).send({
      success: false,
      data: "username khong ton tai",
    })
    return
  }

  let result = await bcrypt.compare(password, user.password)
  if (result) {
    var tokenUser = jwt.sign(
      {
        id: user._id,
      },
      "NNPTUD_S6",
      { expiresIn: "1d" }
    )
    res
      .status(200)
      .cookie("token", tokenUser, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .send({
        success: true,
        data: tokenUser,
      })
  } else {
    res.status(404).send({
      success: false,
      data: "password sai",
    })
  }
})

router.post("/logout", protect, async function (req, res, next) {
  res.status(200).cookie("token", null).send({
    success: true,
    data: "dang xuat thanh cong",
  })
})

router.get("/me", protect, async function (req, res, next) {
  res.status(200).send({
    success: true,
    data: req.user,
  })
})

module.exports = router
