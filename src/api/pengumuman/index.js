import { Router } from "express";
import PengumumanHandler from "./handler.js";
import {
  verifyTokenAdmin,
  verifyTokenSiswa,
  verifyTokenUmum,
} from "../../middelwares/verifyToken.js";

const pengumumanHandler = new PengumumanHandler();

const router = Router();

router.get("/", verifyTokenUmum, pengumumanHandler.getHandler);
router.get("/siswa", verifyTokenSiswa, pengumumanHandler.getBySiswaHandler);
router.get("/:kelas", verifyTokenUmum, pengumumanHandler.getByKelasHandler);
router.post("/", verifyTokenAdmin, pengumumanHandler.postHandler);
router.delete("/:_id", verifyTokenAdmin, pengumumanHandler.deleteHandler);

export default router;
