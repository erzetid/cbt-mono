import Kelas from "../../model/kelas.js";
import BaseHandler from "../default.js";
import mongoose from "mongoose";

const kelas = new Kelas();
export default class KelasHandler extends BaseHandler {
  async getHandler(_req, res, _next) {
    try {
      const data = await kelas.getAll();

      return super.render(res, 200, {
        status: "success",
        message: "Kelas berhasil dirender!",
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
      const { nama } = req.body;
      if (typeof nama !== "string" || nama === "") {
        return super.render(res, 400, {
          status: "error",
          message: "nama tidak boleh kosong!",
        });
      }
      const checkNama = await kelas.getByNama(nama);
      if (checkNama) {
        return super.render(res, 400, {
          status: "error",
          message: "Nama tidak tersedia!",
        });
      }
      await kelas.simpan(nama);
      return super.render(res, 200, {
        status: "success",
        message: "Kelas berhasil disimpan!",
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }

  async putHandler(req, res, _next) {
    try {
      const { _id, nama } = req.body;
      if (typeof nama !== "string" || nama === "") {
        return super.render(res, 400, {
          status: "error",
          message: "nama tidak boleh kosong!",
        });
      }
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
      const checkNama = await kelas.getByNama(nama);
      const checkKelas = await kelas.getById(_id);
      if (!checkKelas) {
        return super.render(res, 400, {
          status: "error",
          message: "Nama kelas tidak ditemukan!",
        });
      }
      if (checkNama && checkKelas.nama !== nama) {
        return super.render(res, 400, {
          status: "error",
          message: "Nama kelas tidak tersedia!",
        });
      }
      await kelas.edit(_id, { nama });
      return super.render(res, 200, {
        status: "success",
        message: "Kelas berhasil diupdate!",
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
