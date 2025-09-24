import { Router } from "express";
import { healthCheck } from "../controllers/healthcheckcontroller.js"

const router = Router();
router.route("/").get(healthCheck)// Define a GET route on `/`
// When someone calls GET http://<server-url>/<basepath>/
// → The healthCheck function will be executed

export default router