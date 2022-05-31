import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: String,
});

const tokenService = mongoose.model("tokens", tokenSchema);

export default class Tokens {
  async set() {
    const token = this.makeid();
    const checkToken = await tokenService.find().lean();
    if (checkToken.length) {
      return await tokenService.findByIdAndUpdate(
        checkToken[0]._id.toString(),
        { $set: { token } },
        { new: true }
      );
    }
    return await new tokenService({ token }).save();
  }

  async get() {
    const data = await tokenService.find();
    let token;
    if (!data.length) {
      const _new = await new tokenService({ token: this.makeid() }).save();
      console.log(_new);
      token = _new.token;
    } else {
      token = data[0].token;
    }
    return token;
  }

  async check(token) {
    return await tokenService.findOne({ token });
  }
  makeid() {
    const length = 5;
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
