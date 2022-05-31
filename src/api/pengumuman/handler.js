import Pengumumans from "../../model/pengumuman.js";
import BaseHandler from "../default.js";
import Kelas from "../../model/kelas.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const kelass = new Kelas();
const pengumuman = new Pengumumans();

export default class PengumumanHandler extends BaseHandler {
  async getHandler(_req, res, _next) {
    try {
      const data = await pengumuman.getAll();

      return super.render(res, 200, {
        status: "success",
        message: "Pengumuman berhasail dirender!",
        data,
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }

  async getByKelasHandler(req, res, _next) {
    try {
      const kelas = req.params.kelas;
      const data = await pengumuman.getByKelas(kelas);

      return super.render(res, 200, {
        status: "success",
        message: "Pengumuman berhasail dirender!",
        data,
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }

  async getBySiswaHandler(req, res, _next) {
    try {
      let jwtToken = req.headers.authorization;
      if (!jwtToken)
        return res.status(401).json({
          status: "error",
          message: "Access Denied / Unauthorized request",
        });
      jwtToken = jwtToken.split(" ")[1];
      const { kelas } = jwt.decode(jwtToken);
      const data = await pengumuman.getByKelas(kelas);

      return super.render(res, 200, {
        status: "success",
        message: "Pengumuman berhasail dirender!",
        data,
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }

  async postHandler(req, res, _next) {
    try {
      const { judul, isi, kelas } = req.body;
      if (typeof judul !== "string" || judul === "") {
        return super.render(res, 400, {
          status: "error",
          message: "judul tidak boleh kosong!",
        });
      }
      if (typeof isi !== "string" || isi === "") {
        return super.render(res, 400, {
          status: "error",
          message: "isi tidak boleh kosong!",
        });
      }
      if (
        typeof kelas !== "string" ||
        kelas === "" ||
        !mongoose.isValidObjectId(kelas)
      ) {
        return super.render(res, 400, {
          status: "error",
          message: "kelas tidak boleh kosong!",
        });
      }

      const checkKelas = await kelass.getById(kelas);

      if (!checkKelas) {
        return super.render(res, 400, {
          status: "error",
          message: "Kelas tidak tersedia!",
        });
      }

      const data = await pengumuman.simpan(judul, isi, kelas);
      if (!data) {
        return super.render(res, 400, {
          status: "error",
          message: "Gagal membuat pengumuman!",
        });
      }

      return super.render(res, 200, {
        status: "success",
        message: "Berhasil membuat pengumuman!",
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }

  async deleteHandler(req, res, _next) {
    try {
      const _id = req.params._id;
      if (
        typeof _id !== "string" ||
        _id === "" ||
        !mongoose.isValidObjectId(_id)
      ) {
        return super.render(res, 400, {
          status: "error",
          message: "Id tidak boleh kosong!",
        });
      }
      const checkPengumuman = await pengumuman.getById(_id);
      if (!checkPengumuman) {
        return super.render(res, 400, {
          status: "error",
          message: "Pengumuman tidak ditemukan!",
        });
      }

      await pengumuman.hapus(_id);

      return super.render(res, 200, {
        status: "success",
        message: "Pengumuman berhasail dihapus!",
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }
}
