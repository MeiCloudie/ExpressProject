//localhost:3000/api/v1/students
var express = require("express")
var router = express.Router()

function GenID(num) {
  let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var result = ""
  for (let index = 0; index < num; index++) {
    // var rand = Data.now() % 62 //ki tu giong nhau
    var rand = parseInt(Math.random() * 61)
    result += source[rand]
  }
  return result
}

var students = [
  {
    MSSV: "RmGZEUEf51t",
    HoTen: "Thanh Tung",
    Lop: "20DTHA1",
  },
  {
    MSSV: "nZCBIarGN3P",
    HoTen: "Manh Toan",
    Lop: "20DTHA2",
  },
]

/* GET home page. */
//localhost:3000/api/v1/students
router.get("/", function (req, res, next) {
  var remainstudents = students.filter((student) => !student.isDelete)
  res.status(200).send(remainstudents)
})

//localhost:3000/api/v1/students/1
router.get("/:MSSV", function (req, res, next) {
  let student = students.find((student) => student.MSSV == req.params.MSSV)

  //   for (let index = 0; index < students.length; index++) {
  //     const element = students[index]
  //     if ((element.MSSV = req.params.MSSV)) {
  //       student = element
  //     }
  //   }

  if (student) {
    res.status(200).send(student)
  } else {
    res.status(404).send("MSSV ko ton tai")
  }

  //   res.send(req.params.MSSV)
})

router.post("/add", function (req, res, next) {
  //   if (req.body.MSSV) {
  let student = students.find((student) => student.MSSV == req.body.MSSV)

  if (student) {
    res.status(404).send("MSSV da ton tai")
  } else {
    let newstudent = {
      // MSSV: req.body.MSSV,
      MSSV: GenID(11),
      HoTen: req.body.HoTen,
      Lop: req.body.Lop,
    }
    students.push(newstudent)
    res.status(200).send(newstudent)
  }
  //   } else {
  //     res.status(404).send("data ko hop le")
  //   }
})

router.put("/edit/:MSSV", function (req, res, next) {
  let student = students.find((student) => student.MSSV == req.params.MSSV)
  if (student) {
    student.HoTen = req.body.HoTen
    student.Lop = req.body.Lop
    res.status(200).send(student)
  } else {
    res.status(404).send("MSSV ko ton tai")
  }
})

router.delete("/del/:MSSV", function (req, res, next) {
  let student = students.find((student) => student.MSSV == req.params.MSSV)
  if (student) {
    // var index = student.indexOf(student)
    // students.splice(index, 1)
    student.isDelete = true
    res.status(200).send("xoa thanh cong")
  } else {
    res.status(404).send("MSSV ko ton tai")
  }
})

module.exports = router
