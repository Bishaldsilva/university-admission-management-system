import { asyncHandler  } from "../utils/asyncHandler.js";
import { Staff } from "../model/staff.model.js"
import { uploadOnCloud } from "../utils/cloudinary.js"
import { ExamDetail } from "../model/examDetails.model.js";
import { Student } from "../model/student.model.js"
import { Payment } from "../model/payment.model.js";


const createStaff = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if(name == "" || email == "" || password == ""){
        return res.status(400)
            .json({
                "success": false,
                "message":"All fields are required"
            })
    }

    const createdTeacher = await Staff.create({
        name, email, password
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

const loginStaff = asyncHandler(async (req, res) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(token){
        return res.status(400)
            .json({
                "success": false,
                "message":"please logout to login again"
            })
    }


    const { email, password } = req.body;

    const user = await Staff.findOne({ email });
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
    const loggedInUser = await Staff.findById(user._id).select("-password");
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
                "message":"staff logged in successfully"
            })
})

const logoutStaff = asyncHandler(async (req, res) => {

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
            .clearCookie("accessToken", options)
            .json({
                "success": true,
                "message":"Logged out successfully"
            })
})

const createExamDetails = asyncHandler(async (req, res) => {

    if(req.user.user_type !== "staff"){
        return res.status(400)
            .json({
                "success": false,
                "message":"Only a staff can create exam details"
            })
    }

    const { date, roll_no } = req.body;

    if(date == "" || roll_no == "" || !req.file){
        return res.status(400)
            .json({
                "success": false,
                "message":"All fields are required"
            })
    }

    const student = await Student.findOne({ roll_no })
    if(!student){
        return res.status(400)
            .json({
                "success": false,
                "message":"student with this roll no doesn't exist"
            })
    }

    const detail = await ExamDetail.findOne({ roll_no })
    if(detail){
        return res.status(400)
            .json({
                "success": false,
                "message":"Exam details with this student already exists"
            })
    }

    const path = req.file.path;
    const admit = await uploadOnCloud(path);

    const examDetails = await ExamDetail.create({
        exam_date: new Date(date),
        roll_no,
        admit: admit?.url || null
    })

    if(!examDetails){
        return res.status(500)
            .json({
                "success": false,
                "message":"Something went wrong while creating exam details"
            })
    }

    return res.status(200)
            .json({
                "success": true,
                examDetails
            })
})

const updateStudentRollNo = asyncHandler(async (req, res) => {
    if(req.user.user_type !== "staff"){
        return res.status(400)
            .json({
                "success": false,
                "message":"Only a staff can update roll no"
            })
    }

    const { id } = req.params;
    const { roll_no } = req.body;

    if(!roll_no){
        return res.status(400)
            .json({
                "success": false,
                "message":"Roll no required"
            })
    }

    const student = await Student.findById(id);
    if(!student){
        return res.status(400)
            .json({
                "success": false,
                "message":"Student not found"
            })
    }

    student.roll_no = roll_no;
    student.save({ validateBeforeSave: false })

    return res.status(200)
            .json({
                "success": true,
                student,
                "message":"student roll no updated successfully"
            })
})

const createPayment = asyncHandler(async (req, res) => {
    if(req.user.user_type !== "staff"){
        return res.status(400)
            .json({
                "success": false,
                "message":"Only a staff can update roll no"
            })
    }

    const { roll_no, amount, date } = req.body;

    if(!roll_no || !amount || !date){
        return res.status(400)
            .json({
                "success": false,
                "message":"all fields are required"
            })
    }

    const student = await Student.findOne({ roll_no })
    if(!student){
        return res.status(400)
            .json({
                "success": false,
                "message":"student with this roll no doesn't exist"
            })
    }

    const payment = await Payment.create({
        roll_no, amount: Number(amount),
        date: new Date(date)
    })

    if(!payment){
        return res.status(500)
            .json({
                "success": false,
                "message":"something went wrong hile creating the payment"
            })
    }

    return res.status(200)
            .json({
                "success": true,
                payment
            })
})

export {
    createStaff,
    loginStaff,
    logoutStaff,
    createExamDetails,
    updateStudentRollNo,
    createPayment
}