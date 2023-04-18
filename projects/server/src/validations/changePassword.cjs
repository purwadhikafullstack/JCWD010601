const prisma = require("../utils/client.cjs");
const bcrypt = require("bcrypt");

/** @type {import("express-validator").Schema} */
module.exports = {
  passwordOld: {
    custom: {
      options: async (passwordOld, { req }) => {
        const user = await prisma.user.findUnique({
          where: { id: +req.params.id },
          select: { hashedPassword: true },
        });
        if (!user) throw new Error("Pengguna tidak ditemukan");
        const res = await bcrypt.compare(passwordOld, user.hashedPassword);
        if (!res) {
          throw new Error("Kata sandi lama tidak benar");
        } else {
          return true;
        }
      },
    },
  },
  passwordNew: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Panjang kata sandi kurang dari 8 karakter",
    },
    custom: {
      options: (passwordNew, { req }) => {
        if (passwordNew === req.body.passwordOld) {
          throw new Error("Kata sandi baru tidak beda dengan kata sandi lama");
        } else {
          return true;
        }
      },
    },
  },
  passwordConfirm: {
    custom: {
      options: (passwordConfirm, { req }) => {
        if (passwordConfirm !== req.body.passwordNew) {
          throw new Error(
            "Konfirmasi kata sandi tidak sama dengan kata sandi baru"
          );
        } else {
          return true;
        }
      },
    },
  },
};
