const prisma = require("../utils/client.cjs");

/** @type {import("express-validator").Schema} */
module.exports = {
  email: {
    isEmail: { errorMessage: "Alamat surel tidak sah", bail: true },
    normalizeEmail: true,
    custom: {
      options: async (email) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          throw new Error("Alamat surel sudah terpakai");
        }
      },
    },
  },
};
