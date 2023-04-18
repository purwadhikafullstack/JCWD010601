const router = require("express").Router();

const {
  getOrders,
  getTotalPage,
  cancelOrder,
} = require("../controllers/order.cjs");

router.get("/", getOrders);
router.get("/v2", getTotalPage);
router.post("/v3/:id", cancelOrder);

module.exports = router;
