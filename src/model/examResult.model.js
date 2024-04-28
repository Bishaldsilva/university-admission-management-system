import mongoose,{ Schema } from "mongoose"

const examResultSchema = new Schema({
    teacher_id: {
        type: String,
        required: true
    },
    roll_no: {
        type: String,
        required: true
    },
    dept_id: {
        type: Schema.Types.ObjectId,
        ref: "Department"
    },
    marks: {
        type: Number,
        required: true
    },
    is_qualified: {
        type: Boolean,
        required: true
    }
}, {timestamps: true})

export const ExamResult = mongoose.model("ExamResult", examResultSchema)