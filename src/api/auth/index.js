import { Router } from "express";
import AuthHandler from "./handler.js";
const authHandler = new AuthHandler();
const router = Router();

router.post("/", authHandler.loginHandler);
router.delete("/", authHandler.resetHandler);
router.get("/token", authHandler.getToken);
router.post("/admin", authHandler.registerAdminHandler);

export default router;
