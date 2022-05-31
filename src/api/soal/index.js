import { Router } from "express";
import SoalHandler from "./handler.js";
import { verifyTokenAdmin } from "../../middelwares/verifyToken.js";

const soalHandler = new SoalHandler();
const router = Router();

router.get("/", verifyTokenAdmin, soalHandler.getHandler);
router.get("/:_id", verifyTokenAdmin, soalHandler.getByIdhandler);
router.get("/per_soal/:_id", verifyTokenAdmin, soalHandler.getPerSoal);
router.post("/", verifyTokenAdmin, soalHandler.postHandler);
router.delete("/:_id", verifyTokenAdmin, soalHandler.deleteHandler);
router.put("/pertanyaan", verifyTokenAdmin, soalHandler.edipertanyaanHandler);
router.put("/opsi", verifyTokenAdmin, soalHandler.editOpsiJawaban);
router.put("/jawaban", verifyTokenAdmin, soalHandler.setJawaban);

export default router;
