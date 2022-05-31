import Siswas from "../../model/siswa.js";
import Users from "../../model/user.js";
import BaseHandler from "../default.js";
import bcrypt from "bcrypt";
import Kelas from "../../model/kelas.js";
import mongoose from "mongoose";

const kelass = new Kelas();
const siswa = new Siswas();
const user = new Users();

export default class Siswahandler extends BaseHandler {
  async getHandler(req, res, _next) {
    try {
      const data = await siswa.getAll();

      return super.render(res, 200, {
        status: "success",
        message: "Data siswa berhasil dirender!",
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

  async getByIdHandler(req, res, _next) {
    try {
      const _id = req.params._id;
      const data = await siswa.getById(_id);

      if (!data) {
        return super.render(res, 400, {
          status: "success",
          message: "Siswa tidak ditemukan!",
        });
      }

      return super.render(res, 200, {
        status: "success",
        message: "Data siswa berhasil dirender!",
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
      const { username, password: plainPassword, nisn, nama, kelas } = req.body;
      const validateSpace = (str) => /\s/.test(str);
      if (typeof username !== "string" || username === "") {
        return super.render(res, 400, {
          status: "error",
          message: "Username tidak boleh kosong!",
        });
      }

      if (
        typeof plainPassword !== "string" ||
        plainPassword === "" ||
        plainPassword.length < 8
      ) {
        return super.render(res, 400, {
          status: "error",
          message: "Password minimal 8 karakter!",
        });
      }

      if (validateSpace(plainPassword) || validateSpace(username))
        return super.render(res, 400, {
          status: "error",
          message: "Username dan password tidak boleh ada spasi!",
        });

      if (typeof nisn !== "string" || nisn === "") {
        return super.render(res, 400, {
          status: "error",
          message: "Nisn tidak boleh kosong!",
        });
      }

      if (typeof nama !== "string" || nama === "") {
        return super.render(res, 400, {
          status: "error",
          message: "nama tidak boleh kosong!",
        });
      }

      if (typeof kelas !== "string" || kelas === "") {
        return super.render(res, 400, {
          status: "error",
          message: "kelas tidak boleh kosong!",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(plainPassword, salt);
      const checkUsername = await user.getUsername(username);
      if (checkUsername) {
        return super.render(res, 400, {
          status: "error",
          message: "Username tidak tersedia!",
        });
      }

      const checkNisn = await siswa.getByNisn(nisn);
      if (checkNisn) {
        return super.render(res, 400, {
          status: "error",
          message: "Nisn tidak tersedia!",
        });
      }

      const simpan = await siswa.simpan(nisn, nama, kelas);
      await user.simpan(simpan._id, username, password, "siswa");

      return super.render(res, 201, {
        status: "success",
        message: "Siswa berhasil disimpan!",
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
      const { _id, nama, kelas } = req.body;
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
      if (typeof nama !== "string" || nama === "") {
        return super.render(res, 400, {
          status: "error",
          message: "Nama tidak boleh kosong!",
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

      const siswas = await siswa.editSiswa(_id, { nama, kelas });
      if (!siswas)
        return super.render(res, 400, {
          status: "error",
          message: "Siswa tidak ditemukan!",
        });

      return super.render(res, 200, {
        status: "success",
        message: "Siswa berhasil diupdate!",
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
      )
        return super.render(res, 400, {
          status: "error",
          message: "Id tidak boleh kosong!",
        });

      const checkSiswa = await siswa.getById(_id);
      if (!checkSiswa) {
        return super.render(res, 400, {
          status: "error",
          message: "Siswa tidak ditemukan!",
        });
      }

      await siswa.hapus(_id);
      await user.hapusByIdSiswa(_id);

      return super.render(res, 200, {
        status: "success",
        message: "Siswa berhasil dihapus!",
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
