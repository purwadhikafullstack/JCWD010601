const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  createWarehouse: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(400).json({
          message: "Harus login",
        });
      }

      const user = await prisma.user.findFirst({
        where: { id: req.session.user.id },
      });

      if (user.role !== "ADMIN") {
        return res.status(400).json({
          message: "Anda tidak memiliki otoritas untuk membuat data ini",
        });
      }

      const {
        name,
        managerId,
        province,
        city,
        detail,
        longitude,
        latitude,
        district,
      } = req.body;
      const result = await prisma.warehouse.create({
        data: {
          name,
          managerId,
          province,
          city,
          detail,
          longitude,
          latitude,
          district,
        },
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getNonAffiliatedManagers: async (req, res) => {
    try {
      //softdelete
      // const result = await prisma.user.findMany({
      //   where: { role: "MANAGER", warehouse: { deletedAt: null } },
      // });
      const result = await prisma.user.findMany({
        where: { role: "MANAGER", warehouse: null },
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getManager: async (req, res) => {
    try {
      if (isNaN(req.params.id)) {
        return res.status(400).json({
          message: "Parameter harus berupa number",
        });
      }
      const nonAffiliated = await prisma.user.findMany({
        where: { role: "MANAGER", warehouse: null },
      });
      const currentAffiliation = await prisma.user.findFirst({
        where: { id: parseInt(req.params.id) },
      });

      res.send([...nonAffiliated, currentAffiliation]);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getWarehouses: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(400).json({
          message: "Harus login",
        });
      }

      const user = await prisma.user.findFirst({
        where: { id: req.session.user.id },
      });

      if (user.role !== "ADMIN") {
        return res.status(400).json({
          message: "Anda tidak memiliki otoritas untuk membuat data ini",
        });
      }

      const { name, sortBy, page = 1, size = 10 } = req.query;
      const skip = (page - 1) * size;

      let orderBy;
      switch (sortBy) {
        case "latest":
          orderBy = { updatedAt: "desc" };
          break;
        case "oldest":
          orderBy = { updatedAt: "asc" };
          break;
        default:
          orderBy = { updatedAt: "desc" };
          break;
      }
      const where = {};
      if (name) {
        where.OR = [
          { name: { contains: name } },
          { province: { contains: name } },
          { city: { contains: name } },
          { district: { contains: name } },
          { detail: { contains: name } },
        ];
      }

      const result = await prisma.warehouse.findMany({
        //softdelete
        // where: {
        //   deletedAt: null,
        // },
        where,
        include: {
          manager: {
            select: { email: true },
          },
        },
        skip: parseInt(skip),
        take: parseInt(size),
        orderBy: orderBy,
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getTotalPage: async (req, res) => {
    try {
      const { name, size = 10 } = req.query;
      const where = {};

      if (name) {
        where.OR = [
          { name: { contains: name } },
          { province: { contains: name } },
          { city: { contains: name } },
          { district: { contains: name } },
          { detail: { contains: name } },
        ];
      }
      const totalProduct = await prisma.warehouse.count({
        where,
      });
      const totalPage = Math.ceil(totalProduct / size);
      res.send({ totalPage });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  deleteWarehouse: async (req, res) => {
    try {
      const user = await prisma.user.findFirst({
        where: { id: req.session.user.id },
      });

      if (user.role !== "ADMIN") {
        return res.status(400).json({
          message: "Anda tidak memiliki otoritas untuk membuat data ini",
        });
      }
      //softdelete
      // const result = await prisma.warehouse.update({
      //   data: { deletedAt: new Date() },
      // });
      const result = await prisma.warehouse.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getWarehouse: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(400).json({
          message: "Harus login",
        });
      }
      if (isNaN(req.params.id)) {
        return res.status(400).json({
          message: "Parameter harus berupa number",
        });
      }
      const user = await prisma.user.findFirst({
        where: { id: req.session.user.id },
      });

      if (user.role !== "ADMIN") {
        return res.status(400).json({
          message: "Anda tidak memiliki otoritas untuk membuat data ini",
        });
      }
      const result = await prisma.warehouse.findFirst({
        where: { id: parseInt(req.params.id) },
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  updateWarehouse: async (req, res) => {
    try {
      const {
        name,
        managerId,
        province,
        city,
        detail,
        longitude,
        latitude,
        district,
      } = req.body;
      const result = await prisma.warehouse.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name,
          managerId,
          province,
          city,
          detail,
          longitude,
          latitude,
          district,
        },
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
};
