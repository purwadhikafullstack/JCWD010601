const axios = require("axios").default;
const prisma = require("../utils/client.cjs");
const cities = require("../utils/cities.json");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  getCost: async (req, res) => {
    try {
      const { addressId, quantity } = req.params;

      const select = { id: true, city: true, latitude: true, longitude: true };
      const userAddress = await prisma.userAddress.findUnique({
        where: { id: +addressId },
        select,
      });
      const warehouses = await prisma.warehouse.findMany({ select });
      const filtered = warehouses.filter(
        ({ city }) => city === userAddress.city
      );
      const found =
        filtered.length === 1
          ? filtered[0]
          : (filtered.length > 1 ? filtered : warehouses)
              .map(({ id, city, latitude, longitude }) => ({
                id,
                city,
                distance:
                  Math.abs(latitude - userAddress.latitude) ** 2 +
                  Math.abs(longitude - userAddress.longitude) ** 2,
              }))
              .reduce((prev, curr) =>
                prev.distance < curr.distance ? prev : curr
              );

      const findCityId = (cityName) =>
        cities.find(
          ({ city_name }) => city_name.toLowerCase() === cityName.toLowerCase()
        )?.city_id;
      const origin = findCityId(found.city);
      const destination = findCityId(userAddress.city);

      const gramsPerUnit = 500;
      const rajaOngkirParams = (courier) => [
        "https://api.rajaongkir.com/starter/cost",
        { origin, destination, weight: gramsPerUnit * +quantity, courier },
        { headers: { key: process.env.API_KEY_RAJAONGKIR } },
      ];

      const jne = await axios.post(...rajaOngkirParams("jne"));
      const pos = await axios.post(...rajaOngkirParams("pos"));
      const tiki = await axios.post(...rajaOngkirParams("tiki"));

      const parseCost = (res, type) =>
        res.data.rajaongkir.results[0].costs.find(
          ({ service }) => service === type
        ).cost[0].value;

      res.json({
        success: true,
        warehouseId: found.id,
        results: {
          jne: parseCost(jne, origin === destination ? "CTC" : "REG"),
          pos: parseCost(pos, "Pos Reguler"),
          tiki: parseCost(tiki, "REG"),
        },
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({
        success: false,
        errors: { unknown: err?.response?.data ?? err },
      });
    }
  },
};
