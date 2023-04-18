const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  createOrder: async (req, res) => {
    try {
      const {
        addressId,
        shipmentMethod,
        shipmentPrice,
        userId,
        warehouseId,
        products,
      } = req.body;

      const { detail, street, city, province, postalCode } =
        await prisma.userAddress.findUniqueOrThrow({
          where: { id: +addressId },
        });

      await prisma.order.create({
        data: {
          status: "UNSETTLED",
          userAddressFull: `${detail} ${street}, ${city}, ${province} ${postalCode}`,
          shipmentMethod,
          shipmentPrice: +shipmentPrice,
          user: { connect: { id: +userId } },
          warehouse: { connect: { id: +warehouseId } },
          details: {
            createMany: {
              data: products.map(({ id, quantity, priceRupiahPerUnit }) => ({
                productId: +id,
                quantity: +quantity,
                priceRupiahPerUnit: +priceRupiahPerUnit,
              })),
            },
          },
        },
      });

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ success: false, errors: { unknown: err } });
    }
  },
  getOrders: async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = 0, take, status } = { ...req.query };

      const filter = status && { status };

      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          shipmentPrice: true,
          status: true,
          details: {
            select: {
              priceRupiahPerUnit: true,
              quantity: true,
              product: { select: { name: true, imageUrl: true } },
            },
          },
        },
        skip: +page * 3,
        ...(take && { take: +take }),
        where: { user: { id: +userId }, ...filter },
      });

      res.json({
        success: true,
        orders,
        ...(take && {
          pages: [
            ...new Array(
              Math.ceil(
                (await prisma.order.count({ where: { ...filter } })) / take
              )
            ).keys(),
          ],
        }),
      });
    } catch (err) {
      res.status(400).json({ success: false, errors: { unknown: err } });
    }
  },
  uploadProof: async (req, res) => {
    try {
      const { orderId } = req.params;

      await prisma.order.update({
        where: { id: +orderId },
        data: { paymentImageUrl: req.file.filename, status: "REQUESTED" },
      });

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ success: false, errors: { unknown: err } });
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const { orderId } = req.params;

      const order = await prisma.order.findUnique({
        where: { id: +orderId },
        select: { status: true },
      });

      if (order?.status !== "UNSETTLED")
        throw new Error(
          "Pembatalan pesanan hanya boleh sebelum pengunggahan bukti pembayaran"
        );

      await prisma.order.update({
        where: { id: +orderId },
        data: { status: "CANCELLED" },
      });

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ success: false, errors: { unknown: err } });
    }
  },
};
