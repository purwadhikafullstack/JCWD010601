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
          await prisma.userPrimaryAddress.create({
            data: { userId: req.session.user.id },
          });
        } else {
          await prisma.userPrimaryAddress.update({
            where: { userId: req.session.user.id },
            data: { addressId: result.id },
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
      const addresses = await prisma.userAddress.findMany({
        where: { userId: req.session.user.id },
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
      console.log(result);
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
};
