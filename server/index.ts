import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//routes

//error handling
app.use(errorHandlerMiddleware);

//database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("You are connected to the mongodb"))
  .catch((e) => console.log(e));

const port = process.env.PORT;

//server connection
app.listen(port, () => {
  console.log(`the server is working on port ${port}`);
});
