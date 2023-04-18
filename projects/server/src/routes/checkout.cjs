const router = require("express").Router();
const { getCost } = require("../controllers/checkout.cjs");

router.get("/cost/:addressId/:quantity", getCost);

module.exports = router;
