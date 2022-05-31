import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../../model/user.js";
import Siswas from "../../model/siswa.js";
import BaseHandler from "../default.js";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../../config/index.js";

const user = new Users();
const siswa = new Siswas();

export default class AuthHandler extends BaseHandler {
  async getToken(req, res, _next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return super.render(res, 401, {
          status: "error",
          message: "Access Denied / Unauthorized request",
        });
      }

      const cekRefreshToken = await user.getRefreshToken(refreshToken);
      if (!cekRefreshToken) {
        return super.render(res, 401, {
          status: "error",
          message: "Access Denied / Unauthorized request",
        });
      }

      const verifyRefresToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

      const checkUsername = await user.getById(verifyRefresToken.user);

      let payload;
      if (!checkUsername.idUser) {
        payload = {
          user: checkUsername._id,
          role: checkUsername.role,
        };
      } else {
        const { kelas } = await siswa.getById(checkUsername.idUser);

        payload = {
          user: checkUsername._id,
          kelas,
          idUser: checkUsername.idUser,
          role: checkUsername.role,
        };
      }

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "3600s",
      });

      const refreshTokenNew = jwt.sign(
        { user: checkUsername._id },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );
      await user.setRefresToken(checkUsername._id, refreshTokenNew);
      res.cookie("refreshToken", refreshTokenNew, {
        proxy: true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
      });
      return super.render(res, 200, {
        status: "success",
        message: "Refresh token berhasil!",
        token,
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 403, {
        status: "error",
        message: "Access forbidden!",
      });
    }
  }

  async loginHandler(req, res, _next) {
    try {
      const { username, password } = req.body;
      const checkUsername = await user.getUsername(username);
      if (!checkUsername) {
        return super.render(res, 400, {
          status: "error",
          message: "Username tidak ditemukan!",
        });
      }

      const match = await bcrypt.compare(password, checkUsername.password);
      if (!match) {
        return super.render(res, 400, {
          status: "error",
          message: "Passwor salah!",
        });
      }
      let payload;
      if (!checkUsername.idUser) {
        payload = {
          user: checkUsername._id,
          role: checkUsername.role,
        };
      } else {
        const { kelas } = await siswa.getById(checkUsername.idUser);
        payload = {
          user: checkUsername._id,
          kelas,
          idUser: checkUsername.idUser,
          role: checkUsername.role,
        };
      }

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "3600s",
      });

      const refreshToken = jwt.sign(
        { user: checkUsername._id },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );
      await user.setRefresToken(checkUsername._id, refreshToken);
      res.cookie("refreshToken", refreshToken, {
        proxy: true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
      });
      super.render(res, 200, {
        status: "success",
        message: "Login berhasil!",
        token,
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }

  async resetHandler(req, res, _next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return super.render(res, 401, {
          status: "error",
          message: "Access Denied / Unauthorized request",
        });
      }

      const cekRefreshToken = await user.getRefreshToken(refreshToken);

      if (!cekRefreshToken) {
        return super.render(res, 401, {
          status: "error",
          message: "Access Denied / Unauthorized request",
        });
      }

      await user.setRefresToken(cekRefreshToken._id, null);

      res.clearCookie("refreshToken");
      return super.render(res, 200, {
        status: "success",
        message: "User berhasil keluar!",
      });
    } catch (error) {
      console.log(error);
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }

  async registerAdminHandler(req, res, _next) {
    try {
      const { username, password: plainPassword } = req.body;
      const validateSpace = (str) => /\s/.test(str);
      if (typeof username !== "string" || username === "") {
        return super.render(res, 400, {
          status: "error",
          message: "Username tidak boleh kosong!",
        });
      }

      if (
        typeof plainPassword !== "string" ||
        plainPassword === "" ||
        plainPassword.length < 8
      ) {
        return super.render(res, 400, {
          status: "error",
          message: "Password minimal 8 karakter!",
        });
      }

      if (validateSpace(plainPassword) || validateSpace(username))
        return super.render(res, 400, {
          status: "error",
          message: "Username dan password tidak boleh ada spasi!",
        });
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(plainPassword, salt);
      const checkUsername = await user.getUsername(username);
      if (checkUsername) {
        return super.render(res, 400, {
          status: "error",
          message: "Username tidak tersedia!",
        });
      }

      await user.simpanAdmin(username, password);

      super.render(res, 200, {
        status: "success",
        message: "Berhasil menyimpan admin baru!",
        username,
        password,
      });
    } catch (error) {
      return super.render(res, 500, {
        status: "error",
        message: "Mohon maaf, kesalahan server!",
      });
    }
  }
}
