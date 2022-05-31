import Soals from "../../model/soal.js";
import BaseHandler from "../default.js";
import mongoose from "mongoose";

const soal = new Soals();

export default class SoalHandler extends BaseHandler {
  async getHandler(_req, res, _next) {
    try {
      const _data = await soal.getAll();
      const data = _data.map((item) => {
        return {
          _id: item._id,
          nama: item.nama,
          jumlah: item.jumlah,
          diperbarui: item.diperbarui,
        };
      });

      return super.render(res, 200, {
        status: "success",
        message: "Data soal berhasil dirender!",
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
      const { nama, jumlah, jumlahOpsi } = req.body;
      if (typeof nama !== "string" || nama === "") {
        return super.render(res, 400, {
          status: "error",
          message: "Nama soal tidak boleh kosong!",
        });
      }
      if (typeof jumlah !== "number" || jumlah < 1) {
        return super.render(res, 400, {
          status: "error",
          message: "jumlah soal tidak boleh kosong!",
        });
      }
      if (typeof jumlahOpsi !== "number" || jumlahOpsi < 1) {
        return super.render(res, 400, {
          status: "error",
          message: "jumlah opsi soal tidak boleh kosong!",
        });
      }
      await soal.simpan(nama, jumlah, jumlahOpsi);
      return super.render(res, 201, {
        status: "success",
        message: "Soal berhasil disimpan!",
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }

  async getByIdhandler(req, res, _next) {
    try {
      const _id = req.params._id;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: "error",
          message: "Id soal tidak ditemukan!",
        });
      const data = await soal.getById(_id);
      if (!data) {
        return super.render(res, 400, {
          status: "error",
          message: "Soal tidak ditemukan!",
        });
      }

      // TODO sebagai acuan untuk membuat nomor dengan array
      const dataSoal = data.butir.map((x, index) => {
        const { _id } = x;
        const no = index + 1;
        return { no, _id };
      });

      const final = { _id: data._id, nama: data.nama, dataSoal };
      return super.render(res, 200, {
        status: "success",
        message: "Data soal ditemukan!",
        data: final,
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
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: "error",
          message: "Id soal tidak ditemukan!",
        });
      const checkSoal = await soal.getById(_id);
      if (!checkSoal) {
        return super.render(res, 400, {
          status: "error",
          message: "Soal tidak ditemukan!",
        });
      }
      await soal.hapus(_id);
      return super.render(res, 200, {
        status: "success",
        message: "Soal berhasil dihapus!",
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }

  async getPerSoal(req, res, _next) {
    try {
      const _id = req.params._id;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: "error",
          message: "Id per soal tidak ditemukan!",
        });
      const data = await soal.getPerSoal(_id);
      if (!data)
        return super.render(res, 400, {
          status: "error",
          message: "Id per soal tidak ditemukan!",
        });
      return super.render(res, 200, {
        status: "success",
        message: "Soal berhasil ditemukan!",
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

  async edipertanyaanHandler(req, res, _next) {
    try {
      const { _id, pertanyaan, pilihan } = req.body;
      if (!pilihan || !Array.isArray(pilihan) || !pilihan.length)
        return super.render(res, 400, {
          status: "error",
          message: "Pilihan ganda tidak boleh ada yang kosong!",
        });
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: "error",
          message: "Id butir soal tidak ditemukan!",
        });

      if (typeof pertanyaan !== "string" || pertanyaan === "")
        return super.render(res, 400, {
          status: "error",
          message: "Pertanyaan tidak boleh kosong!",
        });

      const updatePertanyaan = await soal.editPertanyaan(
        _id,
        pertanyaan,
        pilihan
      );
      if (!updatePertanyaan)
        return super.render(res, 400, {
          status: "error",
          message: "Pertanyaan tidak ditemukan!",
        });

      return super.render(res, 200, {
        status: "success",
        message: "Pertanyaan berhasil diedit!",
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }

  async editOpsiJawaban(req, res, _next) {
    try {
      const { _id, opsi } = req.body;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: "error",
          message: "Id opsi tidak ditemukan!",
        });

      if (typeof opsi !== "string" || opsi === "")
        return super.render(res, 400, {
          status: "error",
          message: "Opsi jawaban tidak boleh kosong!",
        });

      const updateOpsiJawaban = await soal.editOpsi(_id, opsi);
      if (!updateOpsiJawaban)
        return super.render(res, 400, {
          status: "error",
          message: "Id opsi tidak ditemukan!",
        });

      return super.render(res, 200, {
        status: "success",
        message: "Id opsi berhasil diedit!",
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }

  async setJawaban(req, res, _next) {
    try {
      const { _id, jawaban } = req.body;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: "error",
          message: "Id butir soal tidak ditemukan!",
        });

      if (typeof jawaban !== "string" || jawaban === "")
        return super.render(res, 400, {
          status: "error",
          message: "Opsi jawaban tidak boleh kosong!",
        });

      if (!(await soal.findOpsi(jawaban)))
        return super.render(res, 400, {
          status: "error",
          message: "Jawban tidak ditemukan!",
        });

      const setJawaban = await soal.setJawabanSoal(_id, jawaban);
      if (!setJawaban)
        return super.render(res, 400, {
          status: "error",
          message: "Id butir soal tidak ditemukan!",
        });

      return super.render(res, 200, {
        status: "success",
        message: "Jawaban berhasil dipilih!",
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
