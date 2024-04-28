import { asyncHandler } from "../utils/asyncHandler.js";
import { Department } from "../model/department.model.js";
import { Teacher } from "../model/teacher.model.js";
import { Student } from "../model/student.model.js";
import { ExamResult } from "../model/examResult.model.js";


const createTeacher = asyncHandler(async (req, res) => {
    const { name, email, password, dept_name, branch } = req.body;

    if(name == "" || email == "" || password == "" || dept_name == "" || branch == ""){
        return res.status(400)
            .json({
                "success": false,
                "message":"All fields are required"
            })
    }

    let ifBranch = branch == "" ? undefined : branch;

    const dept = await Department.findOne({ name: dept_name, branch : ifBranch });
    const createdTeacher = await Teacher.create({
        name, email, dept_id: dept._id, password
    })

    if(!createdTeacher){
        return res.status(500)
            .json({
                "success": false,
                "message":"Something went wrong while creating the teacher"
            })
    }

    return res.status(200)
            .json({
                "success": true,
                "data": createdTeacher,
                "message":"teacher registered successfully"
            })
})

const loginTeacher = asyncHandler(async (req, res) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(token){
        return res.status(400)
            .json({
                "success": false,
                "message":"please logout to login again"
            })
    }


    const { email, password } = req.body;

    const user = await Teacher.findOne({ email });
    if(!user){
        return res.status(400)
            .json({
                "success": false,
                "message":"email doesn't exist"
            })
    }

    const correctPassword = await user.isPasswordCorrect(password);
    if(!correctPassword){
        return res.status(400)
            .json({
                "success": false,
                "message":"wrong password"
            })
    }

    const accessToken = user.generateAccessToken();
    const loggedInUser = await Teacher.findById(user._id).select("-password");
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                "success": true,
                accessToken,
                "data": loggedInUser,
                "message":"teacher logged in successfully"
            })
})

const logoutTeacher = asyncHandler(async (req, res) => {

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
            .clearCookie("accessToken", options)
            .json({
                "success": true,
                "message":"Teacher logout successfully"
            })
})

const createResult = asyncHandler(async (req, res) => {

    if(req.user.user_type !== "student"){
        return res.status(400)
            .json({
                "success": false,
                "message":"Only a teacher can generate result"
            })
    }

    const { roll_no, marks } = req.body;

    const student = await Student.findOne({ roll_no });
    if(!student){
        return res.status(400)
            .json({
                "success": false,
                "message":"student with this roll no doesn't exist"
            })
    }

    const result = await ExamResult.create({
        teacher_id: req.user._id,
        roll_no,
        dept_id: req.user.dept_id,
        marks,
        is_qualified: marks > 50
    })
    if(!result){
        return res.status(500)
            .json({
                "success": false,
                "message":"something went wrong"
            })
    }

    return res.status(200)
            .json({
                "success": true,
                "message":"result generated successfully"
            })
})

export {
    createTeacher,
    loginTeacher,
    logoutTeacher,
    createResult
}