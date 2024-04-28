import mongoose,{ Schema } from "mongoose";

const paymentSchema = new Schema({
    roll_no: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, {timestamps: true})

export const Payment = mongoose.model("payment", paymentSchema);