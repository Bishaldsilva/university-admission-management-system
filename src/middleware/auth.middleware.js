import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import {Student} from "../model/student.model.js"
import {Teacher} from "../model/teacher.model.js"
import {Staff} from "../model/staff.model.js"


const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(!token){
        return res.status(400)
            .json({
                "success": false,
                "message":"You are not logged in"
            })
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let user;
    if(decoded.type == "teacher"){
        user = await Teacher.findById(decoded._id)
    } else if(decoded.type == "student"){
        user = await Student.findById(decoded._id)
    } else {
        user = await Staff.findById(decoded._id)
    }

    if(!user){
        return res.status(400)
            .json({
                "success": false,
                "message":"Invalid Token"
            })
    }

    req.user = user;
    next();
})

export {
    verifyJWT
}