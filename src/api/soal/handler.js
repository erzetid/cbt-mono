import Excel from 'exceljs';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import Soals from '../../model/soal.js';
import BaseHandler from '../default.js';

const soal = new Soals();

export default class SoalHandler extends BaseHandler {
  async importHandler(req, res, _next) {
    try {
      const re = /(\.xlsx)$/i;
      if (!re.exec(req.file.originalname)) {
        return super.render(res, 400, {
          status: 'error',
          message: 'File harus xlsx!'
        });
      }
      const workbook = new Excel.Workbook();
      const xls = await workbook.xlsx.readFile(req.file.path);
      let namaSoal = '';
      const butir = [];
      let pilihan = [];
      let jawaban = '';
      let _soal = '';
      xls.getWorksheet(1).eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber < 1) {
          return super.render(res, 400, {
            status: 'error',
            message: 'Soal masih kosong!'
          });
        }
        if (rowNumber === 1) {
          namaSoal = row.values[2];
        }
        if (rowNumber > 3) {
          if (row.values[1]) {
            pilihan.push({
              opsi: row.values[3],
              _id: new mongoose.Types.ObjectId()
            });
            if (pilihan[row.values[4]])
              jawaban = pilihan[row.values[4]]._id.toString();
            _soal = row.values[2];
          }
          if (!row.values[1]) {
            butir.push({
              soal: _soal,
              pilihan,
              jawaban,
              _id: new mongoose.Types.ObjectId()
            });
            pilihan = [];
          }
        }
      });
      const importSoal = {
        nama: namaSoal,
        jumlah: butir.length,
        butir
      };
      await soal.import({ ...importSoal });
      fs.unlinkSync(req.file.path);
      return super.render(res, 200, {
        status: 'success',
        message: 'Import berhasil!',
        importSoal
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async exportHandler(req, res, _next) {
    try {
      const id = req.params._id;
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('Soal');
      const getSoal = await soal.getById(id);
      worksheet.addRow(['Nama soal:', getSoal.nama]);
      worksheet.addRow([]);
      worksheet.addRow(['No', 'Soal', 'Pilihan', 'Jawaban']);
      let start = 4;
      let jawab = '';
      getSoal.butir.forEach((item, index) => {
        const _start = start;
        item.pilihan.forEach((item2, index2) => {
          const jawaban = item2._id.toString() === item.jawaban;
          if (jawaban) jawab = index2;
          worksheet.addRow([
            index + 1,
            item.soal,
            item2.opsi,
            jawaban ? index2 : ''
          ]);
          start++;
        });
        const end = start - 1;
        worksheet.mergeCells(`A${_start}:A${end}`);
        worksheet.mergeCells(`B${_start}:B${end}`);
        worksheet.mergeCells(`D${_start}:D${end}`);
        worksheet.getCell(`D${_start}:D${end}`).value = jawab;
        worksheet.addRow([]);
        worksheet.mergeCells(`A${start}:D${start}`);
        jawab = '';
        start++;
      });
      const pathExport = path.join(
        path.resolve(),
        'assets/' + getSoal.nama + '.xlsx'
      );
      await workbook.xlsx.writeFile(pathExport);
      // const data = await workbook.xlsx.writeFile(`${pathExport}/users.xlsx`);
      return res.download(`${pathExport}`);
      // return super.render(res, 200, {
      //   status: 'success',
      //   message: 'Data soal berhasil dirender!',
      //   getSoal
      // });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async getHandler(_req, res, _next) {
    try {
      const _data = await soal.getAll();
      const data = _data.map((item) => {
        return {
          _id: item._id,
          nama: item.nama,
          jumlah: item.jumlah,
          diperbarui: item.diperbarui
        };
      });

      return super.render(res, 200, {
        status: 'success',
        message: 'Data soal berhasil dirender!',
        data
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
      const { nama, jumlah, jumlahOpsi } = req.body;
      if (typeof nama !== 'string' || nama === '') {
        return super.render(res, 400, {
          status: 'error',
          message: 'Nama soal tidak boleh kosong!'
        });
      }
      if (typeof jumlah !== 'number' || jumlah < 1) {
        return super.render(res, 400, {
          status: 'error',
          message: 'jumlah soal tidak boleh kosong!'
        });
      }
      if (typeof jumlahOpsi !== 'number' || jumlahOpsi < 1) {
        return super.render(res, 400, {
          status: 'error',
          message: 'jumlah opsi soal tidak boleh kosong!'
        });
      }
      await soal.simpan(nama, jumlah, jumlahOpsi);
      return super.render(res, 201, {
        status: 'success',
        message: 'Soal berhasil disimpan!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async getByIdhandler(req, res, _next) {
    try {
      const _id = req.params._id;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id soal tidak ditemukan!'
        });
      const data = await soal.getById(_id);
      if (!data) {
        return super.render(res, 400, {
          status: 'error',
          message: 'Soal tidak ditemukan!'
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
        status: 'success',
        message: 'Data soal ditemukan!',
        data: final
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
      const _id = req.params._id;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id soal tidak ditemukan!'
        });
      const checkSoal = await soal.getById(_id);
      if (!checkSoal) {
        return super.render(res, 400, {
          status: 'error',
          message: 'Soal tidak ditemukan!'
        });
      }
      await soal.hapus(_id);
      return super.render(res, 200, {
        status: 'success',
        message: 'Soal berhasil dihapus!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async getPerSoal(req, res, _next) {
    try {
      const _id = req.params._id;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id per soal tidak ditemukan!'
        });
      const data = await soal.getPerSoal(_id);
      if (!data)
        return super.render(res, 400, {
          status: 'error',
          message: 'Id per soal tidak ditemukan!'
        });
      return super.render(res, 200, {
        status: 'success',
        message: 'Soal berhasil ditemukan!',
        data
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async edipertanyaanHandler(req, res, _next) {
    try {
      const { _id, pertanyaan, pilihan } = req.body;
      if (!pilihan || !Array.isArray(pilihan) || !pilihan.length)
        return super.render(res, 400, {
          status: 'error',
          message: 'Pilihan ganda tidak boleh ada yang kosong!'
        });
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id butir soal tidak ditemukan!'
        });

      if (typeof pertanyaan !== 'string' || pertanyaan === '')
        return super.render(res, 400, {
          status: 'error',
          message: 'Pertanyaan tidak boleh kosong!'
        });

      const updatePertanyaan = await soal.editPertanyaan(
        _id,
        pertanyaan,
        pilihan
      );
      if (!updatePertanyaan)
        return super.render(res, 400, {
          status: 'error',
          message: 'Pertanyaan tidak ditemukan!'
        });

      return super.render(res, 200, {
        status: 'success',
        message: 'Pertanyaan berhasil diedit!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async editOpsiJawaban(req, res, _next) {
    try {
      const { _id, opsi } = req.body;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id opsi tidak ditemukan!'
        });

      if (typeof opsi !== 'string' || opsi === '')
        return super.render(res, 400, {
          status: 'error',
          message: 'Opsi jawaban tidak boleh kosong!'
        });

      const updateOpsiJawaban = await soal.editOpsi(_id, opsi);
      if (!updateOpsiJawaban)
        return super.render(res, 400, {
          status: 'error',
          message: 'Id opsi tidak ditemukan!'
        });

      return super.render(res, 200, {
        status: 'success',
        message: 'Id opsi berhasil diedit!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async setJawaban(req, res, _next) {
    try {
      const { _id, jawaban } = req.body;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id butir soal tidak ditemukan!'
        });

      if (typeof jawaban !== 'string' || jawaban === '')
        return super.render(res, 400, {
          status: 'error',
          message: 'Opsi jawaban tidak boleh kosong!'
        });

      if (!(await soal.findOpsi(jawaban)))
        return super.render(res, 400, {
          status: 'error',
          message: 'Jawban tidak ditemukan!'
        });

      const setJawaban = await soal.setJawabanSoal(_id, jawaban);
      if (!setJawaban)
        return super.render(res, 400, {
          status: 'error',
          message: 'Id butir soal tidak ditemukan!'
        });

      return super.render(res, 200, {
        status: 'success',
        message: 'Jawaban berhasil dipilih!'
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

const y = [
  {
    soal: 'Konjungsi yang terdapat pada kalimat 5 pada paragraf di atas termasuk konjungsi...',
    pilihan: [
      { opsi: 'Orang pertama pelaku utama', _id: '62c0ce69e9f82b0a2e507a38' },
      {
        opsi: 'Orang pertama pelaku sampingan',
        _id: '62c0ce69e9f82b0a2e507a39'
      },
      { opsi: 'Orang kedua pelaku utama', _id: '62c0ce69e9f82b0a2e507a3a' },
      { opsi: 'Orang ketiga pelaku utama', _id: '62c0ce69e9f82b0a2e507a3b' },
      { opsi: 'Orang ketiga pelaku sampingan', _id: '62c0ce69e9f82b0a2e507a3c' }
    ]
  },
  {
    soal: 'Perhatikan pendapat berikut: Terdapat beberapa diksi yang jarang didengar masyarakat Indonesia yang tinggal di daerah pelosok. Selain itu, penggunaan kata hubung dan partikel yang kurang tepat membuat pembaca harus mengulang bacaan kalimat agar bisa memahami cerita secara utuh. Aspek resensi yang berkaitan dengan pendapat tersebut adalah...',
    pilihan: [
      { opsi: 'Subordinatif', _id: '62c0ce69e9f82b0a2e507a3d' },
      { opsi: 'Antarkalimat', _id: '62c0ce69e9f82b0a2e507a3e' },
      { opsi: 'Koordinatif', _id: '62c0ce69e9f82b0a2e507a3f' },
      { opsi: 'Kausal', _id: '62c0ce69e9f82b0a2e507a40' },
      { _id: '62c0ce69e9f82b0a2e507a41' }
    ]
  }
];
