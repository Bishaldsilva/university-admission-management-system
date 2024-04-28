import mongoose,{ Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const teacherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dept_id: {
        type: Schema.Types.ObjectId,
        ref: "Department"
    },
    password: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        default: "teacher"
    }
}, {timestamps: true})

teacherSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

teacherSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

teacherSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            type: this.user_type
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const Teacher = mongoose.model("Teacher", teacherSchema);