import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SavedRecipe.css";
import noResult from "../noResult.json";
import Lottie from "lottie-react";

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = window.localStorage.getItem("userID");

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/recipe/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, []);

  return (
    <div className="main-container">
      {savedRecipes.length <= 0 && (
        <div style={{ width: "60%", height: "70%" }}>
          <Lottie loop={true} animationData={noResult} height={10} width={20} />
        </div>
      )}

      {savedRecipes.map((recipe) => (
        <div className="saved-recipe-div" key={recipe._id}>
          <div className="pic-div">
            <img src={recipe.imageUrl} alt={recipe.name} className="food-img" />
          </div>
          <div className="data-div">
            <div className="name-btn-div">
              <h3>{recipe.name}</h3>
            </div>
            <p>Time: {recipe.cookingTime} minutes</p>
            <div className="foodInstructions">{recipe.instructions}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedRecipes;
