import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    branch: {
        type: String
    }
}, {timestamps: true})

export const Department = mongoose.model("Department", departmentSchema)