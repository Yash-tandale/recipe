import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { userRouter } from "./routes/users.js";
import { recipeRouter } from "./routes/recipes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/auth", userRouter);
app.use("/recipe", recipeRouter);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to db..."))
  .catch((err) => console.log(err.message));

app.listen(PORT, () => console.log("Server started"));
