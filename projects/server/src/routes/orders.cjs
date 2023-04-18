const router = require("express").Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "./public/payments");
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
  createOrder,
  getOrders,
  uploadProof,
  cancelOrder,
} = require("../controllers/orders.cjs");

router
  .post("/", createOrder)
  .get("/:userId", getOrders)
  .patch("/detail/:orderId", upload.single("receipt"), uploadProof)
  .delete("/detail/:orderId", cancelOrder);

module.exports = router;
