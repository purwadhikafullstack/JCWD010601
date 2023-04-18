const router = require("express").Router();
const { checkSchema } = require("express-validator");
const {
  register,
  setPassword,
  check,
  login,
  resetPassword,
} = require("../controllers/auth.cjs");
const emailSchema = require("../validations/email.cjs");
const nameSchema = require("../validations/name.cjs");
const passwordSchema = require("../validations/password.cjs");
const { resetPasswordSchema } = require("../validations/resetPassword.cjs");

const { validate, loginValidator } = require("../validations/login.cjs");

router
  .post("/register", checkSchema({ ...emailSchema, ...nameSchema }), register)
  .post("/set-password", checkSchema(passwordSchema), setPassword);

router.post("/v2", loginValidator(), validate, login);
router.get("/v3", check);
router.post("/v4", checkSchema(resetPasswordSchema), resetPassword);

module.exports = router;
