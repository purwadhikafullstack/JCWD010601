const axios = require("axios");
const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  getProvinces: async (_req, res) => {
    try {
      const response = await axios.get(
        "https://api.rajaongkir.com/starter/province",
        { headers: { key: process.env.API_KEY_RAJAONGKIR } }
      );
      res.send({ results: response.data.rajaongkir.results });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getCitys: async (req, res) => {
    try {
      const response = await axios.get(
        "https://api.rajaongkir.com/starter/city?province=" +
          req.query.province,
        {
          headers: { key: process.env.API_KEY_RAJAONGKIR },
        }
      );
      res.send({ results: response.data.rajaongkir.results });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  createAddress: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(400).json({
          message: "Harus login",
        });
      }
      const {
        latitude,
        longitude,
        province,
        city,
        detail,
        street,
        postalCode,
        main,
      } = req.body;
      // const user = await prisma.user.update({
      //   where: { id: req.session.user.id },
      //   data: {
      //     addresses: {
      //       create: {
      //         latitude,
      //         longitude,
      //         province,
      //         city,
      //         detail,
      //         street,
      //         postalCode,
      //         primaryAddress: main && {
      //           connectOrCreate: {
      //             where: { userId: req.session.user.id },
      //             create: { userId: req.session.user.id },
      //           },
      //         },
      //       },
      //     },
      //   },
      //   include: { addresses: true },
      // });

      const result = await prisma.userAddress.create({
        data: {
          userId: req.session.user.id,
          latitude: latitude,
          longitude: longitude,
          province: province,
          city: city,
          street: street,
          postalCode: postalCode,
          detail: detail,
        },
      });
      if (main) {
        const primaryAddress = await prisma.userPrimaryAddress.findFirst({
          where: { userId: req.session.user.id },
        });
        if (primaryAddress) {
          await prisma.userPrimaryAddress.update({
            where: { userId: req.session.user.id },
            data: { addressId: result.id },
          });
        } else {
          await prisma.userPrimaryAddress.create({
            data: { userId: req.session.user.id, addressId: result.id },
          });
        }
      }
      res.send({ message: "Berhasil" });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getAddresses: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(400).json({
          message: "Harus login",
        });
      }

      const { name, page = 1, size = 5, sortBy = "latest" } = req.query;
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

      const where = {
        AND: {
          userId: req.session.user.id,
        },
      };

      if (name) {
        where.OR = [
          { province: { contains: name } },
          { city: { contains: name } },
          { street: { contains: name } },
          { detail: { contains: name } },
          { postalCode: { contains: name } },
        ];
      }
      const addresses = await prisma.userAddress.findMany({
        where,
        where,
        skip: parseInt(skip),
        take: parseInt(size),
        orderBy: orderBy,
      });
      const primaryAddress = await prisma.userPrimaryAddress.findFirst({
        where: { userId: req.session.user.id },
      });
      let newResult = [];
      if (primaryAddress) {
        addresses.map((address) => {
          if (address.id === primaryAddress.addressId) {
            newResult.unshift({ ...address, main: true });
          } else {
            newResult.push(address);
          }
        });
      } else {
        newResult = addresses;
      }
      res.send(newResult);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  updateAddress: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(400).json({
          message: "Harus login",
        });
      }
      const {
        latitude,
        longitude,
        province,
        city,
        detail,
        street,
        postalCode,
        main,
      } = req.body;

      const address = await prisma.userAddress.findFirst({
        where: { id: parseInt(req.params.id) },
      });

      if (address.userId !== req.session.user.id) {
        return res.status(400).json({
          message: "Anda tidak memiliki otoritas untuk mengupdate data ini",
        });
      }

      const result = await prisma.userAddress.update({
        where: { id: parseInt(req.params.id) },
        data: {
          userId: req.session.user.id,
          latitude: latitude,
          longitude: longitude,
          province: province,
          city: city,
          street: street,
          postalCode: postalCode,
          detail: detail,
        },
      });
      const primaryAddress = await prisma.userPrimaryAddress.findFirst({
        where: { userId: req.session.user.id },
      });
      if (main) {
        if (primaryAddress) {
          await prisma.userPrimaryAddress.update({
            where: { userId: req.session.user.id },
            data: { addressId: parseInt(req.params.id) },
          });
        } else {
          await prisma.userPrimaryAddress.create({
            data: {
              userId: req.session.user.id,
              addressId: parseInt(req.params.id),
            },
          });
        }
      } else {
        if (primaryAddress.addressId === parseInt(req.params.id)) {
          await prisma.userPrimaryAddress.delete({
            where: { userId: req.session.user.id },
          });
        }
      }
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },

  getAddress: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(400).json({
          message: "Harus login",
        });
      }

      const address = await prisma.userAddress.findFirst({
        where: { id: parseInt(req.params.id) },
      });

      if (address.userId !== req.session.user.id) {
        return res.status(400).json({
          message: "Anda tidak memiliki otoritas untuk mengakses data ini",
        });
      }
      const result = await prisma.userAddress.findFirst({
        where: { id: parseInt(req.params.id) },
        select: {
          id: true,
          latitude: true,
          longitude: true,
          province: true,
          city: true,
          street: true,
          detail: true,
        },
      });
      const primaryAddress = await prisma.userPrimaryAddress.findFirst({
        where: { userId: req.session.user.id },
      });
      if (primaryAddress) {
        if (primaryAddress.addressId === result.id) {
          result["main"] = true;
        }
      }
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  deleteAddress: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(400).json({
          message: "Harus login",
        });
      }

      const address = await prisma.userAddress.findFirst({
        where: { id: parseInt(req.params.id) },
      });

      if (address.userId !== req.session.user.id) {
        return res.status(400).json({
          message: "Anda tidak memiliki otoritas untuk menghapus data ini",
        });
      }

      const primaryAddress = await prisma.userPrimaryAddress.findFirst({
        where: { addressId: parseInt(req.params.id) },
      });

      if (primaryAddress) {
        await prisma.userPrimaryAddress.delete({
          where: { addressId: parseInt(req.params.id) },
        });
      }

      const result = await prisma.userAddress.delete({
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
  getTotalPage: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(400).json({
          message: "Harus login",
        });
      }
      const { name, size = 5 } = req.query;

      const where = {
        AND: {
          userId: req.session.user.id,
        },
      };
      if (name) {
        where.OR = [
          { province: { contains: name } },
          { city: { contains: name } },
          { street: { contains: name } },
          { detail: { contains: name } },
          { postalCode: { contains: name } },
        ];
      }
      const totalProduct = await prisma.userAddress.count({
        where,
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
