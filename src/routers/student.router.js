import { Router } from "express";
import { 
    getExamDetails,
    getResult,
    loginStudent,
    logoutStudent,
    registerStudent 
} from "../controller/student.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create").post(registerStudent);
router.route("/login").post(loginStudent);
router.route("/logout").post(verifyJWT ,logoutStudent);

router.route("/exam-details").get(verifyJWT ,getExamDetails);
router.route("/exam-result").get(verifyJWT ,getResult);


export default router;