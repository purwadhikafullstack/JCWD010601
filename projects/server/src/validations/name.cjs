/** @type {import("express-validator").Schema} */
module.exports = {
  name: {
    isAlpha: {
      errorMessage: "Kolom nama hanya boleh mengandung huruf atau spasi",
      options: ["en-US", { ignore: /\s/g }],
    },
    isLength: {
      options: { max: 255 },
      errorMessage: "Kolom nama tidak boleh melebihi 255 karakter",
    },
  },
};
