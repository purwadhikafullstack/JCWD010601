const router = require("express").Router();

const {
  createWarehouse,
  getWarehouse,
  updateWarehouse,
  getWarehouses,
  getTotalPage,
  deleteWarehouse,
  getManager,
  getNonAffiliatedManagers,
} = require("../controllers/warehouses.cjs");

const {
  warehouseValidator,
  validateWarehouse,
} = require("../validations/warehouse.cjs");

router.get("/", getWarehouses);
router.post("/", warehouseValidator(), validateWarehouse, createWarehouse);
router.put("/v1/:id", warehouseValidator(), validateWarehouse, updateWarehouse);
router.get("/v1/:id", getWarehouse);
router.delete("/v1/:id", deleteWarehouse);

router.get("/v2", getNonAffiliatedManagers);
router.get("/v2/:id", getManager);
router.get("/v3", getTotalPage);

module.exports = router;
