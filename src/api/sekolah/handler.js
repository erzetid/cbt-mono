import mongoose from "mongoose";
import Sekolahs from "../../model/sekolah.js";
import BaseHandler from "../default.js";

const sekolah = new Sekolahs();

export default class SekolahHandler extends BaseHandler {
  async getHandler(_req, res, _next) {
    try {
      const data = await sekolah.getAll();
      if (!data.length) {
        const initial = await sekolah.initial();
        return super.render(res, 201, {
          status: "success",
          message: "Initial sekolah berhasail!",
          data: initial,
        });
      }
      return super.render(res, 201, {
        status: "success",
        message: "Initial sekolah berhasail!",
        data: data[0],
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
      const {
        _id,
        namaSekolah,
        email,
        telepon,
        alamatSekolah,
        logo,
        tahunPelajaranSekarang,
      } = req.body;

      if (typeof namaSekolah !== "string" || namaSekolah === "") {
        return super.render(res, 400, {
          status: "error",
          message: "Nama sekolah tidak boleh kosong!",
        });
      }

      if (typeof email !== "string" || email === "") {
        return super.render(res, 400, {
          status: "error",
          message: "email tidak boleh kosong!",
        });
      }
      if (typeof telepon !== "string" || telepon === "") {
        return super.render(res, 400, {
          status: "error",
          message: "telepon tidak boleh kosong!",
        });
      }
      if (typeof alamatSekolah !== "string" || alamatSekolah === "") {
        return super.render(res, 400, {
          status: "error",
          message: "Alamat sekolah tidak boleh kosong!",
        });
      }
      if (typeof logo !== "string" || logo === "") {
        return super.render(res, 400, {
          status: "error",
          message: "Logo sekolah tidak boleh kosong!",
        });
      }
      if (
        typeof tahunPelajaranSekarang !== "string" ||
        tahunPelajaranSekarang === ""
      ) {
        return super.render(res, 400, {
          status: "error",
          message: "Tahun pelajaran sekarang sekolah tidak boleh kosong!",
        });
      }

      if (!mongoose.isValidObjectId(_id)) {
        return super.render(res, 400, {
          status: "error",
          message: "Tahun pelajaran sekarang sekolah tidak boleh kosong!",
        });
      }

      const edit = await sekolah.edit(_id, {
        namaSekolah,
        email,
        telepon,
        alamatSekolah,
        logo,
        tahunPelajaranSekarang,
      });

      if (!edit)
        return super.render(res, 400, {
          status: "error",
          message: "Update sekolah gagal!",
        });
      return super.render(res, 201, {
        status: "success",
        message: "Update sekolah berhasail!",
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
