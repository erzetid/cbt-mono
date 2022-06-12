import mongoose from 'mongoose';

const guruSchema = new mongoose.Schema({
  nuptk: String,
  nama: String,
  kelas: String
});

const guruService = mongoose.model('gurus', guruSchema);

export default class Gurus {
  service = guruService;

  async simpan(nuptk, nama, kelas) {
    const guruBaru = new this.service({ nuptk, nama, kelas });
    const query = await guruBaru.save();

    return query;
  }

  async getById(_id) {
    const query = await this.service.findById(_id).lean();

    return query;
  }

  async getByNuptk(nuptk) {
    const query = await this.service.findOne({ nuptk });
    return query;
  }

  async getByKelas(kelas) {
    const query = await this.service.find({ kelas });
    return query;
  }

  async editGuru(_id, data) {
    const query = await this.service.findByIdAndUpdate(
      _id,
      {
        $set: data
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
