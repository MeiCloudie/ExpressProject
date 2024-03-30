var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
var mongoose = require("mongoose")

var app = express()
mongoose
  .connect("mongodb://127.0.0.1:27017/TestS6")
  .then(function () {
    console.log("connected")
  })
  .catch(function (error) {
    console.log(error)
  })

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

// var indexRouter = require("./routes/index")
// var usersRouter = require("./routes/users")

//localhost:3000 -> localhost:3000/api/v1
app.use("/api/v1", require("./routes/index"))
// app.use("/users", usersRouter)
// app.use("/books", require("./routes/books"))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 404)
  // res.render("error")
  res.send({
    success: false,
    data: "URL not found",
  })
})

module.exports = app
