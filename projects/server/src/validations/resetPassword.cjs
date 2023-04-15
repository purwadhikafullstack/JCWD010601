const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express-validator").Schema>} */
module.exports = {
  resetPasswordSchema: {
    email: {
      isEmail: { errorMessage: "Alamat surel tidak sah", bail: true },
      normalizeEmail: true,
      custom: {
        options: async (email, { req }) => {
          const user = await prisma.user.findFirst({
            where: { email, hashedPassword: { not: null } },
          });
          if (!user) {
            throw new Error(`User tidak ditemukan.`);
          }
          req.user = user;
        },
      },
    },
  },
};
