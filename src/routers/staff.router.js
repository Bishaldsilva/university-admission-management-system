import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js"
import { createExamDetails, createPayment, createStaff, loginStaff, logoutStaff, updateStudentRollNo } from "../controller/staff.controller.js";
import { upload } from "../middleware/multer.middleware.js"


const router = Router();

router.route("/create").post(createStaff)
router.route("/login").post(loginStaff)
router.route("/logout").post(verifyJWT, logoutStaff)

router.route("/create-exam-details").post(verifyJWT, upload.single("admit"), createExamDetails)
router.route("/update-roll-no/:id").post(verifyJWT, updateStudentRollNo)
router.route("/payment").post(verifyJWT, createPayment)
export default router;