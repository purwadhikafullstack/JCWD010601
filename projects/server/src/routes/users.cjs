const router = require("express").Router();
const { checkSchema } = require("express-validator");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "./public/avatars");
  },
  filename: (_req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}.${
        file.mimetype.split("/")[1]
      }`
    );
  },
});
const upload = multer({
  limits: { files: 1, fileSize: 1000000 },
  storage,
});
const {
  getUser,
  updateUserName,
  updateUserPassword,
  sendVerification,
  updateUserEmail,
  updateUserAvatar,
} = require("../controllers/users.cjs");
const emailSchema = require("../validations/email.cjs");
const nameSchema = require("../validations/name.cjs");
const changePasswordSchema = require("../validations/changePassword.cjs");

const redirectStack = (key) => (req, _, next) => {
  if (req.body[key] ?? req.file) {
    next();
  } else {
    next("route");
  }
};

router
  .get("/:id", getUser)
  .patch("/:id", redirectStack("name"), checkSchema(nameSchema), updateUserName)
  .patch(
    "/:id",
    redirectStack("passwordNew"),
    checkSchema(changePasswordSchema),
    updateUserPassword
  )
  .patch(
    "/:id",
    redirectStack("email"),
    checkSchema(emailSchema),
    sendVerification
  )
  .patch(
    "/:id",
    upload.single("avatar"),
    redirectStack("avatar"),
    updateUserAvatar
  )
  .patch("/:token", updateUserEmail);

module.exports = router;
