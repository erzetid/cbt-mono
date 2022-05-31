import mongoose from "mongoose";

const sekolahSchema = new mongoose.Schema({
  namaSekolah: String,
  email: String,
  telepon: String,
  alamatSekolah: String,
  logo: String,
  tahunPelajaranSekarang: String,
  kepsek: String,
});

const sekolahService = mongoose.model("sekolahs", sekolahSchema);

export default class Sekolahs {
  service = sekolahService;

  async initial() {
    const data = {
      namaSekolah: "",
      email: "",
      telepon: "",
      alamatSekolah: "",
      logo: "logo",
      tahunPelajaranSekarang: "2022/2023",
    };

    const sekolah = new this.service(data);
    const query = await sekolah.save();

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

  async getAll() {
    const query = await this.service.find();

    return query;
  }
}
