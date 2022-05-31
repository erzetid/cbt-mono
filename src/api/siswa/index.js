import { Router } from "express";
import { verifyTokenAdmin } from "../../middelwares/verifyToken.js";
import Siswahandler from "./handler.js";
const siswahandler = new Siswahandler();

const router = Router();

router.get("/", verifyTokenAdmin, siswahandler.getHandler);
router.get("/:_id", verifyTokenAdmin, siswahandler.getByIdHandler);
router.post("/", verifyTokenAdmin, siswahandler.postHandler);
router.put("/", verifyTokenAdmin, siswahandler.putHandler);
router.delete("/:_id", verifyTokenAdmin, siswahandler.deleteHandler);

export default router;
