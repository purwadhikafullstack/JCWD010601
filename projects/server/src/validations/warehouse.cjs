const { body, validationResult } = require("express-validator");

const warehouseValidator = () => {
  return [
    body("name").notEmpty().withMessage("Nama tidak boleh kosong."),
    body("province").notEmpty().withMessage("Provinsi tidak boleh kosong."),
    body("city").notEmpty().withMessage("Kota/Kabupaten tidak boleh kosong."),
    body("detail").notEmpty().withMessage("Keterangan tidak boleh kosong."),
    body("managerId")
      .isNumeric()
      .withMessage("Manager harus number.")
      .notEmpty()
      .withMessage("Manager tidak boleh kosong."),
    body("longitude")
      .isNumeric()
      .withMessage("Longitude harus number.")
      .notEmpty()
      .withMessage("Longitude tidak boleh kosong."),
    body("latitude")
      .isNumeric()
      .withMessage("Latitude harus number.")
      .notEmpty()
      .withMessage("Latitude tidak boleh kosong."),
  ];
};

const validateWarehouse = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array(),
    });
  }
  return next();
};

module.exports = {
  warehouseValidator,
  validateWarehouse,
};
