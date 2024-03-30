//localhost:3000/api/v1
var express = require("express")
var router = express.Router()

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" })
// })

router.use("/books", require("./books"))
router.use("/authors", require("./authors"))
router.use("/students", require("./students"))
router.use("/users", require("./users"))
router.use("/auth", require("./auth"))

module.exports = router
