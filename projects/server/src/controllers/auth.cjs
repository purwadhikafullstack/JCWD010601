const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { randomUUID } = require("crypto");
const prisma = require("../utils/client.cjs");
// const redis = require("../utils/redis.cjs");
const sendMail = require("../utils/sendMail.cjs");

const passwordPrefix = "pass:";

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  register: async (req, res) => {
    try {
      validationResult(req).throw();

      const { email, name } = req.body;
      const token = randomUUID();
      await prisma.user.create({
        data: {
          email,
          role: "USER",
          token: passwordPrefix + token,
          names: { create: { name } },
        },
        select: { id: true },
      });

      // await redis.set(passwordPrefix + token, user.id, "EX", 86400); // 24 hours

      await sendMail(
        email,
        "Verifkasi Akun",
        `<a href="http://localhost:5173/set-password/${token}">Setel Kata Kunci</a>`
      );

      res.json({ success: true, msg: "Pendaftaran berhasil!" });
    } catch (err) {
      const errors = "errors" in err ? err.mapped() : { unknown: err };
      res.status(400).json({
        success: false,
        errors,
      });
    }
  },
  setPassword: async (req, res) => {
    try {
      validationResult(req).throw();

      const { password, token } = req.body;

      // const id = +(await redis.getdel(passwordPrefix + token));
      const user = await prisma.user.findUnique({
        where: { token: passwordPrefix + token },
        select: { id: true },
      });
      if (!user) throw new Error("Kode tak sah");

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: user.id },
        // data: { hashedPassword, token: null },
        data: { hashedPassword, token: randomUUID() },
      });

      res.json({ success: true, msg: "Kata kunci berhasil tersetel!" });
    } catch (err) {
      const errors = "errors" in err ? err.mapped() : { unknown: err };
      res.status(400).json({
        success: false,
        errors,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // const isValid = await bcrypt.compare(password, user.hashedPassword);
      // if (!isValid) {
      //   return res.status(400).json({
      //     message: "Email and Password does not match",
      //   });
      // }
      if (!user) {
        return res.status(400).json({
          message: "Email and Password does not match",
        });
      }
      const userx = { id: user.id };
      req.session.user = userx;

      res.send({
        result: { id: user.id, role: user.role },
        message: "Login success with Session",
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  check: async (req, res) => {
    try {
      if (!req.session.user?.id) {
        return res.status(404).send("Session not found");
      }

      const user = await prisma.user.findFirst({
        where: { id: req.session.user?.id },
      });

      res.send({ result: { id: user.id, role: user.role } });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      validationResult(req).throw();

      const code = randomUUID();
      await prisma.user.update({
        // untuk mengecek apakah user telah verifikasi atau belum.
        where: { id: req.user.id },
        data: {
          token: passwordPrefix + code,
        },
      });
      await sendMail(
        req.user.email,
        "Ubah Password",
        `<a href="http://localhost:5173/set-password/${code}">Setel Kata Kunci</a>`
      );

      res.json({ success: true, msg: "Kode Verifikasi Berhasil Dikirim!" });
    } catch (error) {
      console.error(error);
      const errors = "errors" in error ? error.mapped() : { unknown: error };
      res.status(400).json({
        success: false,
        errors,
      });
    }
  },
};

const path = require("path");
path.resolve();
