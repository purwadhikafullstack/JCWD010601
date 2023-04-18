const router = require("express").Router();

const {
  getProvinces,
  getCitys,
  getAddress,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getTotalPage,
} = require("../controllers/address.cjs");

router.get("/", getAddresses);
router.post("/", createAddress);

router.get("/v3/:id", getAddress);
router.delete("/:id", deleteAddress);
router.put("/:id", updateAddress);

router.get("/v1/province", getProvinces);
router.get("/v1/city", getCitys);
router.get("/v1", getTotalPage);

module.exports = router;
