const router = require("express").Router();
const { checkSchema } = require("express-validator");
const uniqueNameSchema = require("../validations/uniqueName.cjs");
const editUniqueNameSchema = require("../validations/editUniqueName.cjs");
const {
  getProductCategories,
  createProductCategory,
  editProductCategory,
} = require("../controllers/productCategories.cjs");

router
  .get("/", getProductCategories)
  .post("/", checkSchema(uniqueNameSchema), createProductCategory)
  .put("/:id", checkSchema(editUniqueNameSchema), editProductCategory);

module.exports = router;
