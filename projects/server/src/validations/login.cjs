const { body, validationResult } = require("express-validator");

const loginValidator = () => {
  return [body("email").isEmail().withMessage("bukan email")];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array(),
    });
  }
  return next();
};

module.exports = {
  loginValidator,
  validate,
};
