import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const userID = window.localStorage.getItem("userID");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/recipe/getAll-recipes"
        );
        setRecipes(response.data);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/recipe/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/recipe",
        {
          recipeID,
          userID,
        },
        {
          headers: { authorization: cookies.access_token },
        }
      );
      setSavedRecipes(response.data.savedRecipes);
      alert("Recipe saved");
      navigate("/saved-recipe");
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => (userID ? savedRecipes.includes(id) : null);

  const handleSave = (id) => {
    userID ? saveRecipe(id) : alert("Please login !!!");
  };

  return (
    <div className="container">
      <h1>Recipes</h1>
      {/* <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} minutes</p>
          </li>
        ))}
      </ul> */}
      <div className="grid">
        {recipes.map((recipe) => (
          <div className="recipe-div" key={recipe._id}>
            <div className="img-div">
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="recipe-img"
              />
            </div>
            <div className="content-div">
              <div className="name-btn-div">
                <h3>{recipe.name}</h3>
                <button
                  className="save-btn"
                  onClick={() => handleSave(recipe._id)}
                  disabled={isRecipeSaved(recipe._id)}
                >
                  {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                </button>
              </div>
              <p>Time: {recipe.cookingTime} minutes</p>
              <div className="instructions">{recipe.instructions}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
