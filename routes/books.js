//localhost:3000/api/v1/books
var express = require("express")
var router = express.Router()

var bookModel = require("../schemas/book.js")

// function GenID(num) {
//   let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
//   var result = ""
//   for (let index = 0; index < num; index++) {
//     // var rand = Data.now() % 62 //ki tu giong nhau
//     var rand = parseInt(Math.random() * 61)
//     result += source[rand]
//   }
//   return result
// }

// var books = [
//   {
//     id: 1,
//     name: "toan lop 1",
//   },
//   {
//     id: 2,
//     name: "tieng viet lop 1",
//   },
//   {
//     id: 3,
//     name: "dao duc lop 1",
//   },
// ]

/* GET home page. */
//localhost:3000/api/v1/books
router.get("/", async function (req, res, next) {
  // var remainbooks = books.filter((book) => !book.isDelete)

  //http://localhost:3000/api/v1/books?page=1&limit=10&sort=year&name=Book&author=XYZ
  let queries = {}
  let exclude = ["sort", "page", "limit"]

  //http://localhost:3000/api/v1/books?page=1&limit=10&sort=year&name=Book&year[$gte]=1950
  //Phat trien: Tuong lai se config them
  let arrayString = ["name", "author"]
  let arrayNumber = ["year"]

  for (const [key, value] of Object.entries(req.query)) {
    if (!exclude.includes(key)) {
      queries[key] = new RegExp(value.replace(",", "|"), "i")
    }
  }
  queries.isDeleted = false
  // console.log(req.query)

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

  // let newqueryName = req.query.name.replace(",", "|")

  var books = await bookModel
    .find(queries)
    .populate({ path: "author", select: "_id name" })
    // .lean()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort)
    .exec()
  res.status(200).send(books)

  //---BAI LAM THU KIEM TRA CONTAIN---
  // let query = { isDeleted: false }
  // if (req.query.name) {
  //   let nameKeywords = req.query.name
  //     .split(",")
  //     .map((keyword) => new RegExp(keyword.trim(), "i"))
  //   query.name = { $in: nameKeywords }
  // }
  // if (req.query.author) {
  //   let authorKeywords = req.query.author
  //     .split(",")
  //     .map((keyword) => new RegExp(keyword.trim(), "i"))
  //   query.author = { $in: authorKeywords }
  // }

  // try {
  //   let books = await bookModel
  //     .find(query)
  //     .skip((page - 1) * limit)
  //     .limit(limit)
  //     .sort(sort)
  //     .exec()

  //   res.status(200).send(books)
  // } catch (err) {
  //   console.error(err)
  //   res.status(500).send("Internal Server Error")
  // }
  //---KET THUC BAI LAM---
})

//localhost:3000/api/v1/books/1
router.get("/:id", async function (req, res, next) {
  // let book = books.find((book) => book.id == req.params.id)
  // let book = await bookModel.find({ _id: req.params.id }).exec()
  // let book = await bookModel.findById(req.params.id).exec()

  try {
    // let book = await bookModel.find({ _id: req.params.id }).exec()
    let book = await bookModel.findById(req.params.id).exec()
    res.status(200).send(book)
  } catch (error) {
    res.status(404).send(error)
  }

  //   for (let index = 0; index < books.length; index++) {
  //     const element = books[index]
  //     if ((element.id = req.params.id)) {
  //       book = element
  //     }
  //   }

  // if (book) {
  //   res.status(200).send(book)
  // } else {
  //   res.status(404).send("id ko ton tai")
  // }

  //   res.send(req.params.id)
})

router.post("/add", async function (req, res, next) {
  try {
    var newBook = new bookModel({
      name: req.body.name,
      year: req.body.year,
      author: req.body.author,
    })
    await newBook.save()
    res.status(200).send(newBook)
  } catch (error) {
    res.status(404).send(error)
  }

  // var newBook = new bookModel({
  //   name: req.body.name,
  //   year: req.body.year,
  //   author: req.body.author,
  // })
  // await newBook.save()
  // res.status(200).send(newBook)

  //   if (req.body.id) {
  // let book = books.find((book) => book.id == req.body.id)

  // if (book) {
  //   res.status(404).send("id da ton tai")
  // } else {
  //   let newbook = {
  //     // id: req.body.id,
  //     id: GenID(16),
  //     name: req.body.name,
  //   }
  //   books.push(newbook)
  //   res.status(200).send(newbook)
  // }
  //   } else {
  //     res.status(404).send("data ko hop le")
  //   }
})

router.put("/edit/:id", async function (req, res, next) {
  try {
    var book = await bookModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.status(200).send(book)
  } catch (error) {
    res.status(404).send(error)
  }

  // let book = books.find((book) => book.id == req.params.id)
  // if (book) {
  //   book.name = req.body.name
  //   res.status(200).send(book)
  // } else {
  //   res.status(404).send("id ko ton tai")
  // }
})

router.delete("/del/:id", async function (req, res, next) {
  try {
    var book = await bookModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
      }
    )

    res.status(200).send(book)
  } catch (error) {
    res.status(404).send(error)
  }

  // let book = books.find((book) => book.id == req.params.id)
  // if (book) {
  //   // var index = book.indexOf(book)
  //   // books.splice(index, 1)
  //   book.isDelete = true
  //   res.status(200).send("xoa thanh cong")
  // } else {
  //   res.status(404).send("id ko ton tai")
  // }
})

module.exports = router
