import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import Database from "./database/index.js";
import { MONGO_URI } from "./config/index.js";

export default class Server {
  app = express();
  database = new Database(MONGO_URI);

  constructor(port) {
    this.port = port;
    this.view = {
      staticAdmin: path.join(path.resolve(), "dist/admin/"),
      admin: path.join(path.resolve(), "dist/admin/index.html"),
      staticSiswa: path.join(path.resolve(), "dist/siswa/"),
      siswa: path.join(path.resolve(), "dist/siswa/index.html"),
    };
    this.middelwares();
    this.routes();
    this.database.connect();
  }

  middelwares() {
    this.app.use(cors({ credentials: true, origin: true }));
    this.app.use(cookieParser());
    this.app.disable("x-powered-by");
    this.app.use(express.json());
    this.app.use((_req, _res, next) => {
      return next();
    });
    this.app.use(express.static(this.view.staticAdmin));
    this.app.use(express.static(this.view.staticSiswa));
    this.app.use((err, _req, res, next) => {
      if (err instanceof SyntaxError) {
        return res.status(400).json({
          status: "error",
          message: "Payload/data tidak valid!",
        }); // Bad request
      }
      next();
    });
  }

  listen() {
    return this.app.listen(this.port, () =>
      console.log(`server run on http://localhost:${this.port}`)
    );
  }

  routes() {
    this.app.get("/", (_req, res) => {
      res.send("404 Not Found!");
    });
    this.app.get("/admin", (_req, res) => {
      res.sendFile(this.view.admin);
    });
    this.app.get("/siswa", (_req, res) => {
      res.sendFile(this.view.siswa);
    });
    this.app.use("/api/", router);
  }
}
