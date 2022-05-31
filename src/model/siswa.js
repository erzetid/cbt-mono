import mongoose from "mongoose";

const siswaSchema = new mongoose.Schema({
  nisn: String,
  nama: String,
  kelas: String,
});

const siswaService = mongoose.model("siswas", siswaSchema);

export default class Siswas {
  service = siswaService;

  async simpan(nisn, nama, kelas) {
    const siswaBaru = new this.service({ nisn, nama, kelas });
    const query = await siswaBaru.save();

    return query;
  }

  async getById(_id) {
    const query = await this.service.findById(_id).lean();

    return query;
  }

  async getByNisn(nisn) {
    const query = await this.service.findOne({ nisn });
    return query;
  }

  async editSiswa(_id, data) {
    const query = await this.service.findByIdAndUpdate(
      _id,
      {
        $set: data,
      },
      { new: true }
    );

    return query;
  }

  async hapus(_id) {
    const query = await this.service.findByIdAndDelete(_id);
    return query;
  }

  async getAll() {
    const query = await this.service.find();

    return query;
  }
}
