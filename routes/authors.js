var express = require("express")
var router = express.Router()

var authorModel = require("../schemas/author.js")

router.get("/", async function (req, res, next) {
  var authors = await authorModel.find({}).populate("published").exec()
  res.status(200).send(authors)
  // let queries = {}
  // let exclude = ["sort", "page", "limit"]

  // for (const [key, value] of Object.entries(req.query)) {
  //   if (!exclude.includes(key)) {
  //     queries[key] = new RegExp(value.replace(",", "|"), "i")
  //   }
  // }
  // queries.isDeleted = false

  // let limit = req.query.limit ? req.query.limit : 5
  // let page = req.query.page ? req.query.page : 1
  // let sort = {}

  // if (req.query.sort) {
  //   if (req.query.sort.startsWith("-")) {
  //     sort[req.query.sort.substring(1, req.query.sort.length)] = -1
  //   } else {
  //     sort[req.query.sort] = 1
  //   }
  // }

  // var authors = await authorModel
  //   .find(queries)
  //   .skip((page - 1) * limit)
  //   .limit(limit)
  //   .sort(sort)
  //   .exec()
  // res.status(200).send(authors)
})

router.get("/:id", async function (req, res, next) {
  try {
    let author = await authorModel.findById(req.params.id).exec()
    res.status(200).send(author)
  } catch (error) {
    res.status(404).send(error)
  }
})

router.post("/add", async function (req, res, next) {
  var newAuthor = new authorModel({
    name: req.body.name,
  })
  await newAuthor.save()
  res.status(200).send(newAuthor)
})

router.put("/edit/:id", async function (req, res, next) {
  try {
    var author = await authorModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.status(200).send(author)
  } catch (error) {
    res.status(404).send(error)
  }
})

router.delete("/del/:id", async function (req, res, next) {
  try {
    var author = await authorModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
      }
    )

    res.status(200).send(author)
  } catch (error) {
    res.status(404).send(error)
  }
})

module.exports = router
