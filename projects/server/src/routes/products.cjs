const router = require("express").Router();
const { checkSchema } = require("express-validator");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "./public/products");
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
const uniqueNameSchema = require("../validations/uniqueName.cjs");
const editUniqueNameSchema = require("../validations/editUniqueName.cjs");
const {
  getProducts,
  createProduct,
  editProduct,
} = require("../controllers/products.cjs");

router
  .get("/", getProducts)
  .post(
    "/",
    upload.single("image"),
    checkSchema(uniqueNameSchema),
    createProduct
  )
  .put(
    "/:id",
    upload.single("image"),
    checkSchema(editUniqueNameSchema),
    editProduct
  );

module.exports = router;
