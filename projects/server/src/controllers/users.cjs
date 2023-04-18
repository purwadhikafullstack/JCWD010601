const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { randomUUID } = require("crypto");
const fs = require("fs/promises");
const prisma = require("../utils/client.cjs");
const sendMail = require("../utils/sendMail.cjs");

const emailPrefix = "email:";

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  getUser: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: +req.params.id },
        select: {
          imageUrl: true,
          email: true,
          names: { orderBy: { updatedAt: "desc" }, take: 1 },
          addresses: true,
          primaryAddress: { select: { addressId: true } },
        },
      });
      if (user) {
        res.json({ success: true, user });
      } else throw new Error("Pengguna tidak ditemukan");
    } catch (err) {
      res.status(400).json({ success: false, errors: { unknown: err } });
    }
  },
  updateUserName: async (req, res) => {
    try {
      validationResult(req).throw();

      const { name } = req.body;
      const user = await prisma.user.update({
        where: { id: +req.params.id },
        data: {
          names: {
            upsert: {
              where: { userId_name: { name, userId: +req.params.id } },
              update: { usageCount: { increment: 1 } },
              create: { name },
            },
          },
        },
      });

      res.json({ success: true, user });
    } catch (err) {
      const errors = "errors" in err ? err.mapped() : { unknown: err };
      res.status(400).json({
        success: false,
        errors,
      });
    }
  },
  updateUserPassword: async (req, res) => {
    try {
      validationResult(req).throw();

      const { passwordNew } = req.body;
      const hashedPassword = await bcrypt.hash(passwordNew, 10);
      const user = await prisma.user.update({
        where: { id: +req.params.id },
        data: { hashedPassword },
      });

      res.json({ success: true, user });
    } catch (err) {
      const errors = "errors" in err ? err.mapped() : { unknown: err };
      res.status(400).json({
        success: false,
        errors,
      });
    }
  },
  sendVerification: async (req, res) => {
    try {
      validationResult(req).throw();

      const { email } = req.body;
      // ugly
      const hashedEmail = email
        .split("")
        .reverse()
        .join("")
        .replaceAll(/[.@]/g, "-");
      const token = `${hashedEmail}-${randomUUID()}`;

      await prisma.user.update({
        where: { id: +req.params.id },
        data: { token: emailPrefix + token },
      });

      await sendMail(
        email,
        "Verifkasi untuk Pengubahan Alamat Surel",
        `<a href="http://localhost:5173/change-email/${token}">Verifikasi Alamat Surel Baru</a>`
      );

      res.json({
        success: true,
        msg: "Surel verifikasi telah dikirim ke alamat!",
      });
    } catch (err) {
      const errors = "errors" in err ? err.mapped() : { unknown: err };
      res.status(400).json({
        success: false,
        errors,
      });
    }
  },
  updateUserEmail: async (req, res) => {
    try {
      const { token } = req.params;

      const user = await prisma.user.findUnique({
        where: { token: emailPrefix + token },
        select: { id: true },
      });
      if (!user) throw new Error("Kode tak sah");

      // ugly
      const [xiffus, niamod, emanresu] = token
        .split("-")
        .filter((_, idx) => idx <= 2);
      const email = `${xiffus}.${niamod}@${emanresu}`
        .split("")
        .reverse()
        .join("");

      await prisma.user.update({
        where: { id: user.id },
        // data: { email, token: null },
        data: { email, token: randomUUID() },
      });

      res.json({ success: true, msg: "Alamat surel berhasil diubah!" });
    } catch (err) {
      res.status(400).json({ success: false, errors: { unknown: err } });
    }
  },
  updateUserAvatar: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: +req.params.id },
        select: { imageUrl: true },
      });

      if (user?.imageUrl) {
        await fs.unlink(`./public/avatars/${user.imageUrl}`);
      }

      await prisma.user.update({
        where: { id: +req.params.id },
        data: { imageUrl: req.file.filename },
      });

      res.json({ success: true, msg: "Foto profil berhasil diubah!" });
    } catch (err) {
      res.status(400).json({ success: false, errors: { unknown: err } });
    }
  },
};
