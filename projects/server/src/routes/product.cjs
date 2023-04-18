const router = require("express").Router();

const {
  getProducts,
  getProduct,
  getTotalPage,
  getSomeProducts,
} = require("../controllers/product.cjs");

router.get("/", getProducts);
router.get("/v2", getTotalPage);
router.get("/v3/:id", getProduct);
router.post("/v4", getSomeProducts);

module.exports = router;
