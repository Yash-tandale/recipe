import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import UserModel from "../models/Users.js";
import { verifyToken } from "./users.js";
const router = express.Router();

//get all recipes
router.get("/getAll-recipes", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.json(response);
  } catch (err) {
    // res.json(err);
    console.log(err);
  }
});

// add recipe
router.post("/add-recipe", verifyToken, async (req, res) => {
  console.log(req.body);
  const {
    name,
    description,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
  } = req.body;
  const recipe = new RecipeModel({
    name,
    description,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
  });

  try {
    const response = await recipe.save();
    res.json(response);
  } catch (err) {
    res.json(err.message);
    console.log(err.message);
  }
});

//add saved recipes
router.put("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

//get ids of savedRecipes
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

//get savedRecipes
router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

export { router as recipeRouter };
