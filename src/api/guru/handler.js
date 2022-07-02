import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Gurus from '../../model/guru.js';
import Kelas from '../../model/kelas.js';
import Users from '../../model/user.js';
import BaseHandler from '../default.js';

const kelass = new Kelas();
const guru = new Gurus();
const user = new Users();

export default class GuruHandler extends BaseHandler {
  async getHandler(req, res, _next) {
    try {
      const query = await guru.getAll();
      return super.render(res, 200, {
        status: 'success',
        message: 'Berhasil mengambil data guru',
        data: query
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async deleteHandler(req, res, _next) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return super.render(res, 400, {
          status: 'error',
          message: 'Mohon maaf, data tidak ditemukan!'
        });
      }
      const checkGuru = await guru.getById(id);
      if (!checkGuru) {
        return super.render(res, 400, {
          status: 'error',
          message: 'Mohon maaf, data tidak ditemukan!'
        });
      }
      await guru.hapus(id);
      await user.hapusByIdSiswa(checkGuru.nuptk);
      return super.render(res, 200, {
        status: 'success',
        message: 'Guru berhasil dihapus!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async getByIdHandler(req, res, _next) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return super.render(res, 400, {
          status: 'error',
          message: 'Mohon maaf, data tidak ditemukan!'
        });
      }
      const query = await guru.getById(id);
      if (!query) {
        return res.status(404).json({
          message: 'Guru tidak ditemukan'
        });
      }
      return res.status(200).json({
        message: 'Berhasil mengambil data guru',
        data: query
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async postHandler(req, res, _next) {
    try {
      const { nuptk, nama, kelas } = req.body;
      if (!nuptk) {
        return res.status(400).json({
          status: 'error',
          message: 'NUPTK tidak boleh kosong!'
        });
      }
      if (!nama) {
        return res.status(400).json({
          status: 'error',
          message: 'Nama tidak boleh kosong!'
        });
      }
      if (
        typeof kelas !== 'string' ||
        kelas === '' ||
        !mongoose.isValidObjectId(kelas)
      ) {
        return super.render(res, 400, {
          status: 'error',
          message: 'kelas tidak boleh kosong!'
        });
      }
      const checkKelas = await kelass.getById(kelas);

      if (!checkKelas) {
        return super.render(res, 400, {
          status: 'error',
          message: 'Kelas tidak tersedia!'
        });
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(nuptk, salt);
      await user
        .simpan(nuptk, nuptk, hash, 'guru')
        .then(async (data) => {
          await guru.simpan(nuptk, nama, kelas);
          return super.render(res, 200, {
            status: 'success',
            message: 'Guru berhasil disimpan!'
          });
        })
        .catch((err) => {
          return super.render(res, 400, {
            status: 'error',
            message: 'NUPTK tidak tersedia!'
          });
        });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async putHandler(req, res, _next) {
    try {
      const { nuptk, _id, nama, kelas } = req.body;
      if (!nuptk) {
        return res.status(400).json({
          status: 'error',
          message: 'NUPTK tidak boleh kosong!'
        });
      }
      if (!_id || !mongoose.isValidObjectId(_id)) {
        return res.status(400).json({
          status: 'error',
          message: 'Data tidak ditemukan!'
        });
      }
      if (!nama) {
        return res.status(400).json({
          status: 'error',
          message: 'Nama tidak boleh kosong!'
        });
      }
      if (
        typeof kelas !== 'string' ||
        kelas === '' ||
        !mongoose.isValidObjectId(kelas)
      ) {
        return super.render(res, 400, {
          status: 'error',
          message: 'kelas tidak boleh kosong!'
        });
      }
      const checkKelas = await kelass.getById(kelas);

      if (!checkKelas) {
        return super.render(res, 400, {
          status: 'error',
          message: 'Kelas tidak tersedia!'
        });
      }
      await guru.editGuru(_id, { nama, kelas, nuptk });
      return super.render(res, 200, {
        status: 'success',
        message: 'Guru berhasil diubah!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }
}
