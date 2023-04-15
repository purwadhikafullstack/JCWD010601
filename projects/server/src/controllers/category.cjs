const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  getCategories: async (req, res) => {
    try {
      const { name, sortBy, page = 1, size = 8 } = req.query;
      const skip = (page - 1) * size;
      let orderBy;
      switch (sortBy) {
        case "latest":
          orderBy = { createdAt: "desc" };
          break;
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        default:
          orderBy = { createdAt: "desc" };
          break;
      }
      const categories = await prisma.productCategory.findMany({
        where: {
          name: name ? { contains: name } : undefined,
        },
        skip: parseInt(skip),
        take: parseInt(size),
        orderBy: orderBy,
      });
      res.send(categories);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getTotalPage: async (req, res) => {
    try {
      const { name, size = 8 } = req.query;
      const totalProduct = await prisma.productCategory.count({
        where: {
          name: name ? { contains: name } : undefined,
        },
      });
      const totalPage = Math.ceil(totalProduct / size);
      res.send({ totalPage });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error,
      });
    }
  },
};
