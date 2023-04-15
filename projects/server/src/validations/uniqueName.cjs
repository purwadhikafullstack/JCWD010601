const prisma = require("../utils/client.cjs");

/** @type {import("express-validator").Schema} */
module.exports = {
  name: {
    isAlpha: {
      errorMessage: "Nama hanya boleh mengandung huruf atau spasi",
      options: ["en-US", { ignore: /\s/g }],
    },
    isLength: {
      options: { max: 255 },
      errorMessage: "Nama terlalu panjang",
      bail: true,
    },
    custom: {
      options: async (name) => {
        const productCategory = await prisma.productCategory.findUnique({
          where: { name },
        });

        if (productCategory) {
          throw new Error("Nama yang sama sudah ada");
        } else {
          return true;
        }
      },
    },
  },
};
