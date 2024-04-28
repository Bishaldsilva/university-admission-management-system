import { Router } from "express";
import {
    loginTeacher,
    logoutTeacher,
    createTeacher, 
    createResult
} from "../controller/teacher.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.route("/create").post(createTeacher);
router.route("/login").post(loginTeacher);
router.route("/logout").post(verifyJWT ,logoutTeacher);
router.route("/create-result").post(verifyJWT ,createResult);

export default router;