import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDb from "./db/db.js"

dotenv.config()
const app = express()
connectDb()

app.use(cors())
app.use(express.json())
app.use(cookieParser())


// routes
import studentRouter from "./routers/student.router.js"
import departmentRouter from "./routers/department.router.js"
import teacherRouter from "./routers/teacher.router.js"
import staffRouter from "./routers/staff.router.js"

app.use("/student", studentRouter);
app.use("/department", departmentRouter);
app.use("/teacher", teacherRouter);
app.use("/staff", staffRouter);



app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})