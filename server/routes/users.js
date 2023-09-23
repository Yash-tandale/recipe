import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/Users.js";

const router = express.Router();

//register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ message: "User already exists !!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User added!!" });
    console.log(newUser);
  } catch (error) {
    res.json({ error: error });
    console.log(error);
  }
});

//login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.json({ message: "User not found !!" });
  }

  const verifyPassword = await bcrypt.compare(password, user.password);
  if (!verifyPassword) {
    return res.json({ message: "Password incorrect" });
  }

  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userID: user._id });
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(404);
  }
};
