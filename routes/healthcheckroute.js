import { Router } from "express";
import { healthCheck } from "../controllers/healthcheckcontroller.js"

const router = Router();
router.route("/").get(healthCheck)

export default router