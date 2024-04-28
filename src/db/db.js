import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const conncetDb = async () => {
    try {
        const conn= await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`);
        console.log("Database connected. Host name is ", conn.connection.host);
    } catch (error) {
        console.log(error);
    }
}

export default conncetDb;