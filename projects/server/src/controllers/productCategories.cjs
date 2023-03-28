const { validationResult } = require("express-validator");
const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  getProductCategories: async (req, res) => {
    try {
      const { search = "", column, method, page = 0 } = { ...req.query };

      const filter = { where: { name: { contains: search } } };

      const productCategories = await prisma.productCategory.findMany({
        include: { _count: { select: { products: true } } },
        ...filter,
        orderBy: {
          ...(column === "name" && { name: method }),
          ...(column === "products" && { products: { _count: method } }),
          ...(column === "status" && { deletedAt: method }),
        },
        take: 10,
        skip: +page * 10,
      });

      const count = await prisma.productCategory.count({ ...filter });

      res.json({
        success: true,
        productCategories,
        pages: [...new Array(Math.ceil(count / 10)).keys()],
      });
    } catch (err) {
      res.status(400).json({ success: false, errors: { unknown: err } });
    }
  },
  createProductCategory: async (req, res) => {
    try {
      validationResult(req).throw();

      const { name, status } = req.body;

      await prisma.productCategory.create({
        data: { name, ...(status === "archived" && { deletedAt: new Date() }) },
      });

      res.json({ success: true, msg: "Kategori produk baru berhasil dibuat!" });
    } catch (err) {
      const errors = "errors" in err ? err.mapped() : { unknown: err };
      res.status(400).json({
        success: false,
        errors,
      });
    }
  },
  editProductCategory: async (req, res) => {
    try {
      validationResult(req).throw();

      const { name, status } = { ...req.body };

      await prisma.productCategory.update({
        where: { id: +req.params.id },
        data: {
          ...(name && { name }),
          ...(status && {
            deletedAt: status === "published" ? null : new Date(),
          }),
        },
      });

      res.json({ success: true });
    } catch (err) {
      const errors = "errors" in err ? err.mapped() : { unknown: err };
      res.status(400).json({
        success: false,
        errors,
      });
    }
  },
};
