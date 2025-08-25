import express from "express";
import dotenv from "dotenv";

dotenv.config();
import { dbConnect } from "./config/db.js";
import configureCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import fileRouter from "./routes/fileRoutes.js";


dbConnect();
configureCloudinary();


const app = express()
const port = process.env.PORT||2000 ;


app.use(express.json());


app.use('/', userRouter);
app.use('/', fileRouter);


app.get('/', (req, res) => {
  res.send('Hello Sujal Bhaiya💗!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
