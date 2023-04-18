/** @type {import("express-validator").Schema} */
module.exports = {
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Panjang kata sandi kurang dari 8 karakter",
    },
  },
  passwordConfirm: {
    custom: {
      options: (passwordConfirm, { req }) => {
        if (passwordConfirm !== req.body.password) {
          throw new Error("Konfirmasi kata sandi tidak sama dengan kata sandi");
        } else {
          return true;
        }
      },
    },
  },
};
