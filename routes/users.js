var express = require("express")
var router = express.Router()
// var bcrypt = require("bcrypt")
var checkValid = require("../validators/user.js")
var { validationResult } = require("express-validator")

var userModel = require("../schemas/user.js")

router.get("/", async function (req, res, next) {
  let queries = {}
  let exclude = ["sort", "page", "limit"]

  for (const [key, value] of Object.entries(req.query)) {
    if (!exclude.includes(key)) {
      queries[key] = new RegExp(value.replace(",", "|"), "i")
    }
  }
  queries.isDeleted = false

  let limit = req.query.limit ? req.query.limit : 5
  let page = req.query.page ? req.query.page : 1
  let sort = {}

  if (req.query.sort) {
    if (req.query.sort.startsWith("-")) {
      sort[req.query.sort.substring(1, req.query.sort.length)] = -1
    } else {
      sort[req.query.sort] = 1
    }
  }

  var users = await userModel
    .find(queries)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort)
    .exec()
  res.status(200).send(users)
})

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
