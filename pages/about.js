import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function Search() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [ingredients, setIngredients] = useState([]);

  
  useEffect(() => {
    setRecipes([
      {
        title: "Avocado Toast",
        totalCalories: "250 Calories",
        totalServingSize: "150g",
        totalProtein: "6g",
        img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
    ]);
  }, []);

  const fetchRecipes = async () => {
    if (!searchQuery.trim()) return;
    try {
      
      const [recipeRes, imageRes] = await Promise.all([
        fetch(`https://api.calorieninjas.com/v1/nutrition?query=${searchQuery}`, {
          headers: {
            "X-Api-Key": "bEl9tR2HLYL5bOs2AG5X4g==dHGLeAEQG9mRSViJ", 
          },
        }),
        fetch(
          `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=zFqGmqznz7V5dWru5g1d315FEtkEgMRY0TNa61g8kpw&per_page=1`
        ), 
      ]);

      if (!imageRes.ok) {
        const errorMessage = await imageRes.text();
        console.error("Unsplash API Error:", errorMessage);
        setError("Image API error: " + errorMessage);
        setRecipes([]);
        return;
      }

      const [recipeData, imageData] = await Promise.all([
        recipeRes.json(),
        imageRes.json(),
      ]);

      if (!recipeData.items?.length) {
        setError("No valid recipe found.");
        setRecipes([]);
        setIngredients([]);
        return;
      }

      const round = (key) =>
        recipeData.items.reduce((sum, item) => sum + (item[key] || 0), 0).toFixed(1);

      setRecipes([
        {
          title: searchQuery,
          totalCalories: `${round("calories")} Calories`,
          totalServingSize: `${round("serving_size_g")}g`,
          totalProtein: `${round("protein_g")}g`,
          img: imageData.results[0]?.urls.regular || "https://via.placeholder.com/100",
        },
      ]);
      setError("");

      fetchIngredients();
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching recipe or image data.");
    }
  };

  const fetchIngredients = async () => {
    const apiKey = "f7590d3d2a164049af78a839330a0be2";
    try {
      const searchRes = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${searchQuery}&number=1&apiKey=${apiKey}`
      );
      const searchData = await searchRes.json();

      if (!searchData.results?.length) return setError();

      const recipeId = searchData.results[0].id;
      const infoRes = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
      );
      const infoData = await infoRes.json();

      setIngredients(infoData.extendedIngredients.map((ing) => ing.original));
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      setError("An error occurred while fetching recipe details.");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setError("");
    fetchRecipes();
  };

  return (
    <div className="h-screen w-screen overflow-hidden fixed top-0 left-0 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] text-[#111]">
      <div className="z-50 w-full">
        <Navbar />
      </div>
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/2 px-10 py-6 flex flex-col justify-center bg-white">
          <h1 className="text-3xl font-extrabold mb-4">
            {recipes[0]?.title || "Search a Recipe"}
          </h1>
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a recipe..."
              className="px-4 py-2 w-full border rounded-md"
            />
            <button
              type="submit"
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Search
            </button>
          </form>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {recipes.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Size", value: recipes[0].totalServingSize },
                { label: "Calories", value: recipes[0].totalCalories },
                { label: "Protein", value: recipes[0].totalProtein },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border rounded-md text-center py-4 bg-white hover:bg-[#00cfff] hover:text-white"
                >
                  <div className="font-medium">{item.label}</div>
                  <div className="font-semibold">{item.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 bg-[#fafafa] flex flex-col items-center justify-center relative">
          {recipes.length > 0 && (
            <img
              src={recipes[0].img}
              alt={recipes[0].title}
              className="rounded-xl w-[90%] h-[600px] object-contain mb-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}
