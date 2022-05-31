import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  idSiswa: String,
  idSoal: String,
  idUjian: String,
  durasi: Number,
  waktuMulai: Number,
  waktuSelesai: Number,
  status: String,
  jawaban: [{ idPertanyaan: String, jawaban: String }],
});

const scoreService = mongoose.model("scores", scoreSchema);

export default class Scores {
  async save(data) {
    return new scoreService(data).save();
  }

  async getByIdSiswaAndIdUjian(idSiswa, idUjian) {
    return await scoreService.findOne({ idSiswa, idUjian });
  }

  async getScoresByIdUjian(idUjian) {
    return await scoreService.find({ idUjian }).lean();
  }

  async getById(_id) {
    return await scoreService.findById(_id).lean();
  }

  async updateJawaban(idScore, idPertanyaan, jawaban) {
    return await scoreService.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(idScore),
        "jawaban.idPertanyaan": idPertanyaan,
      },
      {
        $set: {
          "jawaban.$.jawaban": jawaban,
        },
      },
      { new: true }
    );
  }

  async updateById(_id, data) {
    return await scoreService.findByIdAndUpdate(_id, data);
  }
}
