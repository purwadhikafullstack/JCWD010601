const router = require("express").Router();
const { getCategories, getTotalPage } = require("../controllers/category.cjs");

router.get("/", getCategories);
router.get("/v2", getTotalPage);

module.exports = router;
