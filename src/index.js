import dotenv from "dotenv"
import { connectDB } from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()
    .then(() => {
        console.log("DB connection established");
    })
    .catch((err) => {
        console.error("Failed to start the application due to DB error:", err);
        process.exit(1);
    });
