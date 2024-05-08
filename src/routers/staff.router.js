import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js"
import { createExamDetails, createStaff, loginStaff, logoutStaff } from "../controller/staff.controller.js";
import { upload } from "../middleware/multer.middleware.js"


const router = Router();

router.route("/create").post(createStaff)
router.route("/login").post(loginStaff)
router.route("/logout").post(verifyJWT, logoutStaff)

router.route("/create-exam-details").post(verifyJWT, upload.single("admit"), createExamDetails)
export default router;