import { Router } from "express";
import { createDepartment } from "../controller/department.controller.js";


const router = Router();

router.route("/create").post(createDepartment);

export default router;