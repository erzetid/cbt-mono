import mongoose from 'mongoose';

const kelasSchema = new mongoose.Schema({
  nama: String
});

const kelasService = mongoose.model('kelas', kelasSchema);

export default class Kelas {
  service = kelasService;

  async simpan(nama) {
    const kelasBaru = new this.service({ nama });
    const query = await kelasBaru.save();

    return query;
  }

  async getAll() {
    const query = await this.service.find();

    return query;
  }

  async getByNama(nama) {
    const query = await this.service.findOne({ nama });

    return query;
  }

  async getById(_id) {
    const query = await this.service.findById(_id);

    return query;
  }

  async edit(_id, data) {
    const query = await this.service.findByIdAndUpdate(
      _id,
      { $set: data },
      { new: true }
    );

    return query;
  }

  async hapus(_id) {
    const query = await this.service.findByIdAndDelete(_id);

    return query;
  }
}
