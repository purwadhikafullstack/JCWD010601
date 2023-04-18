const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  getProducts: async (req, res) => {
    try {
      const {
        name,
        categoryId,
        page = 1,
        size = 15,
        sortBy = "latest",
      } = req.query;

      const skip = (page - 1) * size;

      let orderBy;
      switch (sortBy) {
        case "latest":
          orderBy = { createdAt: "desc" };
          break;
        case "highest":
          orderBy = { priceRupiahPerUnit: "desc" };
          break;
        case "lowest":
          orderBy = { priceRupiahPerUnit: "asc" };
          break;
        default:
          orderBy = { createdAt: "desc" };
          break;
      }

      const products = await prisma.product.findMany({
        where: {
          name: name ? { contains: name } : undefined,
          categoryId: categoryId ? parseInt(categoryId) : undefined,
        },
        include: {
          stocks: true,
          category: true,
        },
        skip: parseInt(skip),
        take: parseInt(size),
        orderBy: orderBy,
      });

      const productsWithTotalQuantity = products.map((product) => {
        const totalQuantity = product.stocks.reduce(
          (acc, stock) => acc + stock.quantity,
          0
        );
        delete product.categoryId;
        delete product.stocks;

        return {
          ...product,
          totalQuantity,
        };
      });
      res.send(productsWithTotalQuantity);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error,
      });
    }
  },
  getTotalPage: async (req, res) => {
    try {
      const { name, categoryId, size = 15 } = req.query;
      const totalProduct = await prisma.product.count({
        where: {
          name: name ? { contains: name } : undefined,
          categoryId: categoryId ? parseInt(categoryId) : undefined,
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
  getProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await prisma.product.findFirst({
        where: {
          id: parseInt(id),
        },
        include: {
          stocks: true,
          category: true,
        },
      });

      const totalQuantity = result.stocks.reduce(
        (acc, stock) => acc + stock.quantity,
        0
      );

      res.send({ ...result, totalQuantity });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error,
      });
    }
  },
  getSomeProducts: async (req, res) => {
    try {
      const { productIds } = req.body;
      const products = await prisma.product.findMany({
        where: {
          id: { in: productIds },
        },
        include: {
          stocks: true,
        },
      });

      const productsWithTotalQuantity = products.map((product) => {
        const totalQuantity = product.stocks.reduce(
          (acc, stock) => acc + stock.quantity,
          0
        );
        delete product.categoryId;
        delete product.stocks;

        return {
          ...product,
          totalQuantity,
        };
      });
      res.send(productsWithTotalQuantity);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error,
      });
    }
  },
};
