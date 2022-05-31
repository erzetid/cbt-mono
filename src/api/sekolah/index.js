import { Router } from "express";
import { verifyTokenAdmin } from "../../middelwares/verifyToken.js";
import SekolahHandler from "./handler.js";

const sekolahHandler = new SekolahHandler();

const router = Router();

router.get("/", verifyTokenAdmin, sekolahHandler.getHandler);
router.put("/", verifyTokenAdmin, sekolahHandler.putHandler);

export default router;
