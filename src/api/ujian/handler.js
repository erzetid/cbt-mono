import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Logs from '../../model/log.js';
import Scores from '../../model/score.js';
import Siswas from '../../model/siswa.js';
import Soals from '../../model/soal.js';
import Tokens from '../../model/token.js';
import Ujian from '../../model/ujian.js';
import BaseHandler from '../default.js';

export default class UjianHandler extends BaseHandler {
  service = new Ujian();
  tokenService = new Tokens();
  siswaService = new Siswas();
  soalService = new Soals();
  logs = new Logs();
  scoreService = new Scores();
  constructor() {
    super();
    this.getHandler = this.getHandler.bind(this);
    this.postHandler = this.postHandler.bind(this);
    this.actifHandler = this.actifHandler.bind(this);
    this.nonaktifHandler = this.nonaktifHandler.bind(this);
    this.hapusHandler = this.hapusHandler.bind(this);
    this.getByIdHandler = this.getByIdHandler.bind(this);
    this.getToken = this.getToken.bind(this);
    this.setToken = this.setToken.bind(this);
    this.mulaiHandler = this.mulaiHandler.bind(this);
    this.updateJawabanHandler = this.updateJawabanHandler.bind(this);
    this.getScoreSiswaHandler = this.getScoreSiswaHandler.bind(this);
    this.getLogsHandler = this.getLogsHandler.bind(this);
    this.getScoresByUjian = this.getScoresByUjian.bind(this);
    this.getPerSoalSiswa = this.getPerSoalSiswa.bind(this);
    this.getByKelasSiswaHandler = this.getByKelasSiswaHandler.bind(this);
    this.preTestHandler = this.preTestHandler.bind(this);
    this.selesaiHandler = this.selesaiHandler.bind(this);
    this.calculateHandler = this.calculateHandler.bind(this);
    this.deleteLogsByIdHandler = this.deleteLogsByIdHandler.bind(this);
    this.calculate = this.calculate.bind(this);
  }
  async getHandler(_req, res, _next) {
    try {
      const data = await this.service.getAll();
      return super.render(res, 200, {
        status: 'success',
        message: 'Ujian berhasil dirender!',
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

  async postHandler(req, res) {
    const { nama, idKelas, durasi, idSoal, status, waktuMulai } = req.body;
    if (typeof nama !== 'string' || nama === '')
      return super.render(res, 400, {
        status: 'error',
        message: 'Nama tidak boleh kosong!'
      });
    if (
      typeof idKelas !== 'string' ||
      idKelas === '' ||
      !mongoose.isValidObjectId(idKelas)
    )
      return super.render(res, 400, {
        status: 'error',
        message: 'Id kelas tidak boleh kosong!'
      });
    if (
      typeof idSoal !== 'string' ||
      idSoal === '' ||
      !mongoose.isValidObjectId(idSoal)
    )
      return super.render(res, 400, {
        status: 'error',
        message: 'Id soal tidak boleh kosong!'
      });
    if (typeof waktuMulai !== 'string' || waktuMulai === '')
      return super.render(res, 400, {
        status: 'error',
        message: 'Waktu mulai tidak boleh kosong!'
      });
    if (typeof durasi !== 'number' || durasi < 10)
      return super.render(res, 400, {
        status: 'error',
        message: 'Durasi minimal 10 menit!'
      });
    const data = await this.service.save({
      nama,
      idKelas,
      durasi,
      idSoal,
      status: 'nonaktif',
      waktuMulai
    });
    try {
      return super.render(res, 200, {
        status: 'success',
        message: 'Ujian berhasil disimpan!',
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

  async actifHandler(req, res) {
    try {
      const { _id } = req.params;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id ujian tidak boleh kosong!'
        });
      const data = await this.service.update(_id, { status: 'aktif' });
      if (!data || (data && data.status !== 'aktif'))
        return super.render(res, 400, {
          status: 'error',
          message: 'Gagal mengaktifkan ujian!'
        });
      return super.render(res, 200, {
        status: 'success',
        message: 'Ujian berhasil diaktifkan!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }
  async nonaktifHandler(req, res) {
    try {
      const { _id } = req.params;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id ujian tidak boleh kosong!'
        });
      const data = await this.service.update(_id, { status: 'nonaktif' });
      if (!data || (data && data.status !== 'nonaktif'))
        return super.render(res, 400, {
          status: 'error',
          message: 'Gagal menonaktifkan ujian!'
        });
      return super.render(res, 200, {
        status: 'success',
        message: 'Ujian berhasil dinonaktifkan!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }
  async hapusHandler(req, res) {
    try {
      const { _id } = req.params;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id ujian tidak boleh kosong!'
        });
      const data = await this.service.deleteById(_id);
      if (!data)
        return super.render(res, 400, {
          status: 'error',
          message: 'Ujian tidak ditemukan!'
        });
      return super.render(res, 200, {
        status: 'success',
        message: 'Ujian berhasil dihapus!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }
  async getByIdHandler(req, res) {
    try {
      const { _id } = req.params;
      if (!mongoose.isValidObjectId(_id))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id ujian tidak boleh kosong!'
        });
      const data = await this.service.getById(_id);
      if (!data)
        return super.render(res, 400, {
          status: 'error',
          message: 'Ujian tidak ditemukan!'
        });
      return super.render(res, 200, {
        status: 'success',
        message: 'Ujian ditemukan!',
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

  async mulaiHandler(req, res) {
    try {
      const { idUjian, token } = req.body;
      if (typeof token !== 'string' || token === '')
        return super.render(res, 400, {
          status: 'error',
          message: 'Token tidak boleh kosong!'
        });

      if (!mongoose.isValidObjectId(idUjian))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id ujian tidak boleh kosong!'
        });

      let jwtToken = req.headers.authorization;
      if (!jwtToken)
        return res.status(401).json({
          status: 'error',
          message: 'Access Denied / Unauthorized request'
        });
      jwtToken = jwtToken.split(' ')[1];
      const { idUser: idSiswa } = jwt.decode(jwtToken);

      const { nama: namaSiswa, kelas: kelasSiswa } =
        await this.siswaService.getById(idSiswa);
      if (!namaSiswa)
        return res.status(400).json({
          status: 'error',
          message: 'Siswa tidak ditemukan!'
        });

      const checkUjian = await this.service.getById(idUjian);
      if (!checkUjian)
        return res.status(400).json({
          status: 'error',
          message: 'Ujian tidak ditemukan!'
        });
      const {
        nama: namaUjian,
        idKelas: kelasUjian,
        status,
        idSoal,
        durasi,
        waktuMulai: waktuMulaiUjian
      } = checkUjian;
      const waktuMulai = Date.now();
      const waktuMulaiUjianMs = new Date(waktuMulaiUjian).getTime();
      if (waktuMulai < waktuMulaiUjianMs)
        return res.status(400).json({
          status: 'error',
          message: 'Ujian belum dimulai!'
        });

      if (kelasUjian !== kelasSiswa)
        return res.status(400).json({
          status: 'error',
          message: 'Kamu tidak diperbolehkan untuk mengerjakan ujian ini!'
        });
      if (status !== 'aktif')
        return res.status(400).json({
          status: 'error',
          message: 'Ujian belum diaktifkan!'
        });
      const checkToken = await this.tokenService.check(token);
      if (!checkToken)
        return super.render(res, 400, {
          status: 'error',
          message: 'Token tidak valid!'
        });
      const checkLog = await this.logs.getByIdSiswaAndIdUjian(idSiswa, idUjian);
      if (checkLog)
        return super.render(res, 400, {
          status: 'error',
          message: 'Siswa sedang mengerjakan ujian!'
        });

      const dataSoal = await this.soalService.getById(idSoal);
      if (!dataSoal)
        return super.render(res, 400, {
          status: 'error',
          message: 'Soal ujian tidak ditemukan!'
        });
      const jawaban = dataSoal.butir.map((x) => {
        return { idPertanyaan: x._id.toString(), jawaban: '' };
      });

      let idScore;

      const checkScore = await this.scoreService.getByIdSiswaAndIdUjian(
        idSiswa,
        idUjian
      );
      if (!checkScore) {
        const newScore = await this.scoreService.save({
          idSiswa,
          idSoal,
          idUjian,
          durasi,
          waktuMulai,
          waktuSelesai: 0,
          status: 'aktif',
          jawaban: this.shuffle(jawaban)
        });
        if (!newScore)
          return super.render(res, 400, {
            status: 'error',
            message: 'Mulai ujian error!'
          });
        idScore = newScore._id;
      } else {
        if (checkScore.status === 'selesai')
          return super.render(res, 400, {
            status: 'error',
            message: 'Kamu sudah menyelesaikan ujian ini!'
          });
        idScore = checkScore._id;
      }
      if (
        !(await this.logs.save({
          idUjian,
          idSiswa,
          namaUjian,
          namaSiswa
        }))
      )
        return res.status(400).json({
          status: 'error',
          message: 'Maaf ada yang salah!'
        });
      return super.render(res, 200, {
        status: 'success',
        message: 'Berhasil!',
        data: { idScore, ...checkUjian }
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async updateJawabanHandler(req, res) {
    try {
      const dateNow = Date.now();
      let jwtToken = req.headers.authorization;
      if (!jwtToken)
        return res.status(401).json({
          status: 'error',
          message: 'Access Denied / Unauthorized request'
        });
      jwtToken = jwtToken.split(' ')[1];
      const { idUser: idSiswa } = jwt.decode(jwtToken);
      const { idScore, idPertanyaan, jawaban } = req.body;
      if (
        !mongoose.isValidObjectId(idScore) ||
        !mongoose.isValidObjectId(idPertanyaan) ||
        !mongoose.isValidObjectId(jawaban)
      )
        return super.render(res, 400, {
          status: 'error',
          message: 'Mohon maaf payload salah!'
        });
      const score = await this.scoreService.getById(idScore);
      if (!score)
        return super.render(res, 400, {
          status: 'error',
          message: 'Hasil ujian tidak ditemukan!'
        });
      if (score.idSiswa !== idSiswa)
        return super.render(res, 400, {
          status: 'error',
          message: 'Kamu tidak berhak mengisikan jawaban ini!'
        });
      const calculateTime = score.waktuMulai + score.durasi * 60000;
      if (dateNow > calculateTime)
        return super.render(res, 402, {
          // TODO (statusCode 402 untuk diparse diclient sebagai ujian timeout)
          status: 'error',
          message: 'Waktu kamu sudah habis!'
        });
      const data = await this.scoreService.updateJawaban(
        idScore,
        idPertanyaan,
        jawaban
      );
      if (!data) {
        return super.render(res, 400, {
          status: 'error',
          message: 'Jawaban tidak dapat diproses!'
        });
      }
      return super.render(res, 200, {
        status: 'success',
        message: 'Jawaban berhasil diperabrui!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async getScoreSiswaHandler(req, res) {
    try {
      let jwtToken = req.headers.authorization;
      if (!jwtToken)
        return res.status(401).json({
          status: 'error',
          message: 'Access Denied / Unauthorized request'
        });
      jwtToken = jwtToken.split(' ')[1];
      const { idUser: idSiswa } = jwt.decode(jwtToken);
      const { idScore } = req.params;
      if (!mongoose.isValidObjectId(idScore))
        return super.render(res, 400, {
          status: 'error',
          message: 'Hasil ujian tidak ditemukan!'
        });
      const score = await this.scoreService.getById(idScore);
      if (!score)
        return super.render(res, 400, {
          status: 'error',
          message: 'Hasil ujian tidak ditemukan!'
        });
      if (score.idSiswa !== idSiswa)
        return super.render(res, 400, {
          status: 'error',
          message: 'Kamu tidak berhak melihat jawaban ini!'
        });
      return super.render(res, 200, {
        status: 'success',
        message: 'Hasil jawaban ditemukan!',
        data: score
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async selesaiHandler(req, res) {
    try {
      let jwtToken = req.headers.authorization;
      if (!jwtToken)
        return res.status(401).json({
          status: 'error',
          message: 'Access Denied / Unauthorized request'
        });
      jwtToken = jwtToken.split(' ')[1];
      const { idUser: idSiswa } = jwt.decode(jwtToken);
      const { idScore } = req.params;
      if (!mongoose.isValidObjectId(idScore))
        return super.render(res, 400, {
          status: 'error',
          message: 'Hasil ujian tidak ditemukan!'
        });
      const score = await this.scoreService.getById(idScore);
      if (!score)
        return super.render(res, 400, {
          status: 'error',
          message: 'Hasil ujian tidak ditemukan!'
        });
      if (score.idSiswa !== idSiswa)
        return super.render(res, 400, {
          status: 'error',
          message: 'Kamu tidak berhak menyelesaikan ujian ini!'
        });
      await this.scoreService.updateById(idScore, {
        waktuSelesai: Date.now(),
        status: 'selesai'
      });
      await this.logs.deleteByIdSiswaIdUjian(idSiswa, score.idUjian);
      return super.render(res, 200, {
        status: 'success',
        message: 'Selamat kamu sudah menyelesaikan ujian ini!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async preTestHandler(req, res) {
    try {
      let jwtToken = req.headers.authorization;
      const { idUjian } = req.params;
      if (!mongoose.isValidObjectId(idUjian))
        return super.render(res, 400, {
          status: 'error',
          message: 'Id ujian tidak boleh kosong!'
        });
      if (!jwtToken)
        return res.status(401).json({
          status: 'error',
          message: 'Access Denied / Unauthorized request'
        });
      jwtToken = jwtToken.split(' ')[1];
      const { idUser: idSiswa } = jwt.decode(jwtToken);
      const checkUjian = await this.service.getById(idUjian);
      if (!checkUjian)
        return res.status(400).json({
          status: 'error',
          message: 'Ujian tidak ditemukan!'
        });
      const { nama: namaSoal, jumlah } = await this.soalService.getById(
        checkUjian.idSoal
      );
      const checkSiswa = await this.siswaService.getById(idSiswa);
      if (!checkSiswa)
        return res.status(400).json({
          status: 'error',
          message: 'Kamu belum terdaftar!'
        });
      const { nama, kelas } = checkSiswa;
      if (checkUjian.idKelas !== kelas)
        return res.status(400).json({
          status: 'error',
          message: 'Kamu tidak punya akses ke ujian ini!'
        });
      return super.render(res, 200, {
        status: 'success',
        message: 'Berhasil!',
        data: {
          ujian: checkUjian.nama,
          nama,
          kelas,
          durasi: checkUjian.durasi,
          jadwal: checkUjian.waktuMulai,
          soal: namaSoal,
          jumlah
        }
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async getLogsHandler(_req, res) {
    try {
      const data = await this.logs.getAll();
      return super.render(res, 200, {
        status: 'success',
        message: 'Berhasil!',
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

  async deleteLogsByIdHandler(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id))
        return super.render(res, 400, {
          status: 'error',
          message: 'Logs tidak ditemukan!'
        });
      const deleted = await this.logs.deleteById(id);
      if (!deleted)
        return super.render(res, 400, {
          status: 'error',
          message: 'Siswa tidak ditemukan!'
        });

      return super.render(res, 200, {
        status: 'success',
        message: 'Berhasil reset!'
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async getScoresByUjian(req, res) {
    try {
      const { idUjian } = req.params;
      if (!mongoose.isValidObjectId(idUjian))
        return super.render(res, 400, {
          status: 'error',
          message: 'Hasil ujian tidak ditemukan!'
        });
      const _data = await this.scoreService.getScoresByIdUjian(idUjian);
      const data = await Promise.all(
        _data.map(async (x) => {
          const { idSiswa, idSoal, _id, waktuMulai, waktuSelesai, status } = x;
          const checkSiswa = await this.siswaService.getById(idSiswa);
          const { nama: soal } = await this.soalService.getById(idSoal);
          const waktuSelesais = waktuSelesai === 0 ? waktuMulai : waktuSelesai;
          const nilai = await this.calculate(_id);

          return {
            nama: checkSiswa && checkSiswa.nama,
            soal,
            idScore: _id,
            nilai,
            waktuMulai: new Date(waktuMulai).toISOString(),
            waktuSelesai: new Date(waktuSelesais).toISOString(),
            status
          };
        })
      );
      // TODO Lihat Hasil Jawaban
      return super.render(res, 200, {
        status: 'success',
        message: 'Berhasil!',
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

  async setToken(_req, res) {
    try {
      const data = await this.tokenService.set();
      if (!data)
        return super.render(res, 400, {
          status: 'error',
          message: 'Gagal memperbarui token gagal!'
        });
      return super.render(res, 200, {
        status: 'success',
        message: 'Token berhasil diperabrui!',
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

  async getPerSoalSiswa(req, res, _next) {
    try {
      let jwtToken = req.headers.authorization;
      if (!jwtToken)
        return res.status(401).json({
          status: 'error',
          message: 'Access Denied / Unauthorized request'
        });
      jwtToken = jwtToken.split(' ')[1];
      const { idUser: idSiswa } = jwt.decode(jwtToken);
      const { idPertanyaan, idUjian } = req.body;
      if (
        !mongoose.isValidObjectId(idPertanyaan) ||
        !mongoose.isValidObjectId(idUjian)
      )
        return super.render(res, 400, {
          status: 'error',
          message: 'Id pertanyaan tidak ditemukan!'
        });
      const checkLog = await this.logs.getByIdSiswaAndIdUjian(idSiswa, idUjian);
      if (!checkLog)
        return super.render(res, 400, {
          status: 'error',
          message: 'Soal tidak bisa dibuka, silahkan login terlebih dahulu!'
        });
      const data = await this.soalService.getPerSoal(idPertanyaan);
      if (!data)
        return super.render(res, 400, {
          status: 'error',
          message: 'Id pertanyaan tidak ditemukan!'
        });
      const { soal, pilihan, _id } = data;
      return super.render(res, 200, {
        status: 'success',
        message: 'Soal berhasil ditemukan!',
        data: { soal, pilihan, _id }
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }
  async getByKelasSiswaHandler(req, res, _next) {
    try {
      let jwtToken = req.headers.authorization;
      if (!jwtToken)
        return res.status(401).json({
          status: 'error',
          message: 'Access Denied / Unauthorized request'
        });
      jwtToken = jwtToken.split(' ')[1];
      const { kelas, idUser } = jwt.decode(jwtToken);
      const _data = await this.service.getByKelasSiswa(kelas);
      const data = await Promise.all(
        _data.map(async (x) => {
          const { _id } = x;
          let statusSiswa = 'Belum dikerjakan';
          const checkScore = await this.scoreService.getByIdSiswaAndIdUjian(
            idUser,
            _id
          );
          if (checkScore) statusSiswa = checkScore.status;
          return { ...x, statusSiswa };
        })
      );

      return super.render(res, 200, {
        status: 'success',
        message: 'Ujian by kelas siswa berhasil dirender!',
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

  async calculateHandler(req, res) {
    try {
      const { idScore } = req.params;
      if (!mongoose.isValidObjectId(idScore))
        return super.render(res, 400, {
          status: 'error',
          message: 'Nilai tidak ditemukan'
        });
      const data = await this.scoreService.getById(idScore);
      if (!data)
        return super.render(res, 400, {
          status: 'error',
          message: 'Nilai tidak ditemukan'
        });
      const point = 100 / data.jawaban.length;

      let count = 0;
      // Counter
      await Promise.all(
        data.jawaban.map(async (x) => {
          const { idPertanyaan, jawaban } = x;
          const checkJawaban = await this.soalService.checkJawaban(
            idPertanyaan,
            jawaban
          );
          if (checkJawaban) count++;
        })
      );
      const hasil = point * count;

      return super.render(res, 200, {
        status: 'success',
        message: 'Calculate',
        hasil
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  async calculate(idScore) {
    if (!mongoose.isValidObjectId(idScore))
      return super.render(res, 400, {
        status: 'error',
        message: 'Nilai tidak ditemukan'
      });
    const data = await this.scoreService.getById(idScore);
    if (!data)
      return super.render(res, 400, {
        status: 'error',
        message: 'Nilai tidak ditemukan'
      });
    const point = 100 / data.jawaban.length;

    let count = 0;
    // Counter
    await Promise.all(
      data.jawaban.map(async (x) => {
        const { idPertanyaan, jawaban } = x;
        const checkJawaban = await this.soalService.checkJawaban(
          idPertanyaan,
          jawaban
        );
        if (checkJawaban) count++;
      })
    );
    const hasil = point * count;

    return hasil;
  }

  async setToken(_req, res) {
    try {
      const data = await this.tokenService.set();
      if (!data)
        return super.render(res, 400, {
          status: 'error',
          message: 'Gagal memperbarui token gagal!'
        });
      return super.render(res, 200, {
        status: 'success',
        message: 'Token berhasil diperabrui!',
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

  async getToken(_req, res) {
    try {
      const token = await this.tokenService.get();
      return super.render(res, 200, {
        status: 'success',
        message: 'Token berhasil dimuat!',
        token
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: 'error',
        message: 'Mohon maaf, kesalahan server!'
      });
    }
  }

  shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ];
    }

    return array;
  }
}
