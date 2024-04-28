import { Department } from "../model/department.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const createDepartment = asyncHandler(async (req, res) => {
    let { name, branch } = req.body;

    if(branch == ""){
        branch = undefined;
    }

    const dept = await Department.findOne({ name, branch });
    if(dept){
        return res.status(400)
            .json({
                "success": false,
                "message":"Department with this name and branch already exist"
            })
    }

    const createdDepartment = await Department.create({
        name, branch
    })
    if(!createdDepartment){
        return res.status(500)
            .json({
                "success": false,
                "message":"Something went wrong while creating the department"
            })
    }

    return res.status(200)
            .json({
                "success": true,
                "data": createdDepartment,
                "message":"Department created successfully"
            })
})

export {
    createDepartment
}