var express = require("express")
var router = express.Router()
var userModel = require("../schemas/user")
var checkvalid = require("../validators/auth")
var checkValidResetPassword = require("../validators/resetpassword")
var checkValidForgotPassword = require("../validators/forgotpassword")
var { validationResult } = require("express-validator")
var bcrypt = require("bcrypt")
var protect = require("../middlewares/protectLogin")
let sendmail = require("../helpers/sendmail")
let resHandle = require("../helpers/resHandle")
let config = require("../configs/config")

router.post(
  "/forgotpassword",
  checkValidForgotPassword(),
  async function (req, res, next) {
    // Kiểm tra validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    let email = req.body.email
    try {
      // Tìm người dùng với email tương ứng
      let user = await userModel.findOne({ email: email })
      if (!user) {
        resHandle(res, false, "Email chưa tồn tại trong hệ thống")
        return
      }
      // Tạo và lưu token để đặt lại mật khẩu
      let token = user.genResetPassword()
      await user.save()
      let url = `http://localhost:3000/api/v1/auth/resetpassword/${token}`
      // Gửi email chứa URL đặt lại mật khẩu
      await sendmail(user.email, url)
      resHandle(res, true, "Gửi email thành công")
    } catch (error) {
      resHandle(res, false, error)
    }
  }
)

router.post(
  "/resetpassword/:token",
  checkValidResetPassword(),
  async function (req, res, next) {
    // Kiểm tra validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      // Tìm người dùng với tokenResetPassword tương ứng
      let user = await userModel.findOne({
        tokenResetPassword: req.params.token,
      })
      if (!user) {
        resHandle(res, false, "URL không hợp lệ")
        return
      }
      // Kiểm tra xem tokenResetPasswordExp đã hết hạn chưa
      if (user.tokenResetPasswordExp > Date.now()) {
        // Cập nhật mật khẩu mới và xóa thông tin token
        user.password = req.body.password
        user.tokenResetPasswordExp = undefined
        user.tokenResetPassword = undefined
        await user.save()
        resHandle(res, true, "Đổi mật khẩu thành công")
      } else {
        resHandle(res, false, "URL không hợp lệ")
        return
      }
    } catch (err) {
      console.error("Lỗi khi đặt lại mật khẩu:", err)
      res.status(500).send("Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")
    }
  }
)

router.post(
  "/changepassword",
  protect,
  checkValidResetPassword(),
  async function (req, res, next) {
    const { oldPassword, password } = req.body

    // Kiểm tra validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      // Tìm thông tin người dùng
      const user = await userModel.findById(req.user.id)
      if (!user) {
        resHandle(res, false, "Không tìm thấy thông tin người dùng")
        return
      }

      // Kiểm tra mật khẩu cũ
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password
      )
      if (!isOldPasswordValid) {
        resHandle(res, false, "Mật khẩu cũ không chính xác")
        return
      }

      // Cập nhật mật khẩu mới và lưu vào cơ sở dữ liệu
      user.password = password
      await user.save()

      resHandle(res, true, "Đổi mật khẩu thành công")
    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error)
      res.status(500).send("Đã xảy ra lỗi trong quá trình xử lý yêu cầu.")
    }
  }
)

router.post("/register", checkvalid(), async function (req, res, next) {
  var result = validationResult(req)
  if (result.errors.length > 0) {
    res.status(404).send(result.errors)
    return
  }
  try {
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
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
    resHandle(res, false, "username va password khong duoc de trong")
    return
  }
  var user = await userModel.findOne({ username: username })
  if (!user) {
    resHandle(res, false, "username khong ton tai")
    return
  }
  let result = bcrypt.compareSync(password, user.password)
  if (result) {
    var tokenUser = user.genJWT()
    res
      .status(200)
      .cookie("token", tokenUser, {
        expires: new Date(Date.now() + config.COOKIES_EXP_HOUR * 3600 * 1000),
        httpOnly: true,
      })
      .send({
        success: false,
        data: tokenUser,
      })
  } else {
    resHandle(res, false, "password sai")
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
