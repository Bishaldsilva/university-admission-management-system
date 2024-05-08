import mongoose, { Schema } from "mongoose"

const examDetailsSchema = new Schema({
    exam_date: {
        type: Date,
        required: true
    },
    roll_no: {
        type: String,
        required: true,
    },
    admit: {
        type: String,
        required: true,
    }
}, {timestamps: true})

export const ExamDetail = mongoose.model("ExamDetail",examDetailsSchema);