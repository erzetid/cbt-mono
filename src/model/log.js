import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  idUjian: String,
  namaUjian: String,
  idSiswa: String,
  namaSiswa: String,
});

const logService = mongoose.model("logs", logSchema);

export default class Logs {
  async save(data) {
    return await new logService({ ...data }).save();
  }

  async getByIdSiswaAndIdUjian(idSiswa, idUjian) {
    return await logService.findOne({ idSiswa, idUjian });
  }

  async getAll() {
    return await logService.find().lean();
  }

  async deleteById(_id) {
    return await logService.findByIdAndDelete(_id);
  }

  async deleteByIdSiswaIdUjian(idSiswa, idUjian) {
    return await logService.findOneAndDelete({ idSiswa, idUjian });
  }
}
