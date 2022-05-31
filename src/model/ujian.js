import mongoose from "mongoose";

const ujianSchema = new mongoose.Schema({
  nama: String,
  idKelas: String,
  idSoal: String,
  durasi: Number,
  status: String,
  waktuMulai: String,
});

const ujianService = mongoose.model("ujians", ujianSchema);
export default class Ujians {
  service = ujianService;
  async save({ nama, idKelas, idSoal, durasi, status, waktuMulai }) {
    const ujianBaru = new this.service({
      nama,
      idKelas,
      idSoal,
      durasi,
      status,
      waktuMulai,
    });

    return ujianBaru.save();
  }

  async getById(_id) {
    return await this.service.findById(_id).lean();
  }

  async getByKelasSiswa(idKelas) {
    return await this.service.find({ idKelas }).lean();
  }

  async getAll() {
    return await this.service.find().lean();
  }

  async update(_id, data) {
    return await this.service.findByIdAndUpdate(
      _id,
      {
        $set: data,
      },
      { new: true }
    );
  }

  async deleteById(_id) {
    return await this.service.findByIdAndDelete(_id);
  }

  async find(data) {
    return await this.service.find(data);
  }
}
