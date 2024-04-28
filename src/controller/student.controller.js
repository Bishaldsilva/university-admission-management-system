import { asyncHandler } from "../utils/asyncHandler.js"
import { Department } from "../model/department.model.js"
import { Student } from "../model/student.model.js";
import { ExamDetail } from "../model/examDetails.model.js";
import mongoose from "mongoose"
import { ExamResult } from "../model/examResult.model.js";

const registerStudent = asyncHandler(async (req, res) => {
    const { name, address, phn_no, email, password, dept_name, branch } = req.body;

    if(name == "" || address == "" || phn_no == "" || email == "" || password == "" || dept_name == "" || branch == ""){
        return res.status(400)
            .json({
                "success": false,
                "message":"All fields are required"
            })
    }

    const student = await Student.findOne({ email })
    if(student){
        return res.status(400)
            .json({
                "success": false,
                "message":"student with this email has already been registered"
            })
    }

    let ifBranch = branch == "" ? undefined : branch;

    const dept = await Department.findOne({ name: dept_name, branch : ifBranch });
    const createdStudent = await Student.create({
        name, address, phn_no, email, dept_id: dept._id, password
    })

    if(!createdStudent){
        return res.status(500)
            .json({
                "success": false,
                "message":"Something went wrong while creating the student"
            })
    }

    return res.status(200)
            .json({
                "success": true,
                "data": createdStudent,
                "message":"student registered successfully"
            })

})

const loginStudent = asyncHandler(async (req, res) => {

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(token){
        return res.status(400)
            .json({
                "success": false,
                "message":"please logout to login again"
            })
    }


    const { email, password } = req.body;

    const user = await Student.findOne({ email });
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
    const loggedInUser = await Student.findById(user._id).select("-password");
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
                "message":"student logged in successfully"
            })
    
})

const logoutStudent = asyncHandler(async (req, res) => {

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
            .clearCookie("accessToken", options)
            .json({
                "success": true,
                "message":"student logout successfully"
            })
})

const getExamDetails = asyncHandler(async (req, res) => {
    if(req.user.user_type !== "student"){
        return res.status(400)
            .json({
                "success": false,
                "message":"Only a student can see the details"
            })
    }

    if(req.user.roll_no === ""){
        return res.status(400)
            .json({
                "success": false,
                "message":"exam details hasn't yet been declared"
            })
    }

    const detail = await ExamDetail.findOne({ roll_no : req.user.roll_no });
    if(!detail){
        return res.status(500)
            .json({
                "success": false,
                "message":"something went wrong"
            })
    }

    return res.status(200)
            .json({
                "success": true,
                detail
            })
})

const getResult = asyncHandler(async (req, res) => {
    if(req.user.user_type !== "student"){
        return res.status(400)
            .json({
                "success": false,
                "message":"Only a student can see the details"
            })
    }

    if(req.user.roll_no === ""){
        return res.status(400)
            .json({
                "success": false,
                "message":"exam result hasn't yet been declared"
            })
    }

    const result = await ExamResult.findOne({ roll_no : req.user.roll_no });
    if(!result){
        return res.status(500)
            .json({
                "success": false,
                "message":"result hasn't yet been generated"
            })
    }

    const marks = result.marks;
    return res.status(200)
            .json({
                "success": true,
                result
            })
})

export {
    registerStudent,
    loginStudent,
    logoutStudent,
    getExamDetails,
    getResult
}