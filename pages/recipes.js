import { useState, useEffect } from "react";

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [visibleIngredients, setVisibleIngredients] = useState({});

  const predefinedRecipes = [
    "French Fries",
    "Grilled Steak",
    "Pepperoni Pizza",
    "Buffalo Wings",
    "Lasagna",
    "Tacos",
    "Chicken Alfredo",
    "Caesar Salad",
    "Spaghetti Bolognese",
    "Chicken Tenders",
    "Garlic Bread",
  ];

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const toggleIngredients = async (title, id) => {
    const isVisible = visibleIngredients[title];

    if (isVisible) {
      setVisibleIngredients((prev) => ({ ...prev, [title]: false }));
    } else {
      if (!recipes.find((r) => r.title === title)?.ingredients) {
        const apiKey = "018c4198935e4c09ab9bf2a34116f9b9";
        try {
          const res = await fetch(
            `https://api.spoonacular.com/recipes/${id}/ingredientWidget.json?apiKey=${apiKey}`
          );
          const data = await res.json();
          const ingredients = data.ingredients?.map((i) => i.name) || [];

          setRecipes((prev) =>
            prev.map((r) =>
              r.title === title ? { ...r, ingredients } : r
            )
          );
        } catch (err) {
          console.error("Error fetching ingredients:", err);
        }
      }

      setVisibleIngredients((prev) => ({ ...prev, [title]: true }));
    }
  };

  const fetchRecipeWithImage = async (title) => {
    const spoonacularKey = "1e07200c388640a0ab9d092241f60292";
    const unsplashKey = "zFqGmqznz7V5dWru5g1d315FEtkEgMRY0TNa61g8kpw";

    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${title}&number=1&apiKey=${spoonacularKey}`
      );
      const data = await res.json();
      if (!data.results?.length) return null;

      const recipe = data.results[0];

      const imageRes = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(title)}&per_page=1&client_id=${unsplashKey}`
      );
      const imageData = await imageRes.json();
      const imageUrl =
        imageData.results?.[0]?.urls?.regular || "https://via.placeholder.com/300";

      return {
        title: recipe.title,
        id: recipe.id,
        img: imageUrl,
        ingredients: null,
      };
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const newRecipe = await fetchRecipeWithImage(searchQuery);
    if (newRecipe) {
      setRecipes((prev) => [newRecipe, ...prev]);
      setVisibleIngredients({});
    }
    setSearchQuery("");
  };

  useEffect(() => {
    const fetchInitial = async () => {
      const selected = shuffle(predefinedRecipes).slice(0, 9);
      const promises = selected.map(fetchRecipeWithImage);
      const results = await Promise.all(promises);
      const valid = results.filter(Boolean);
      setRecipes(valid);
    };

    fetchInitial();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f7fa] via-[#f9fafb] to-white px-6 py-10">
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a recipe..."
            className="p-3 rounded-lg w-full sm:w-96 border border-gray-300 focus:outline-none text-black placeholder-gray-500 shadow"
          />
          <button
            onClick={handleSearch}
            className="bg-[#111] text-white px-5 py-3 rounded-lg hover:bg-[#00cfff] hover:text-black transition"
          >
            Search
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col justify-between"
          >
            <img
              src={recipe.img}
              alt={recipe.title}
              className="w-full h-32 object-cover"
            />

            <div className="p-4 flex-1 flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                {recipe.title}
              </h3>

              <button
                onClick={() => toggleIngredients(recipe.title, recipe.id)}
                className="w-full text-sm py-2 rounded-md bg-[#111] text-white hover:bg-[#00cfff] hover:text-black transition"
              >
                {visibleIngredients[recipe.title]
                  ? "Hide Ingredients"
                  : "View Ingredients"}
              </button>

              {visibleIngredients[recipe.title] && recipe.ingredients && (
                <div className="mt-3 text-sm text-gray-700 max-h-[150px] overflow-y-auto border-t pt-2">
                  <p className="font-semibold mb-1">Ingredients:</p>
                  <ul className="list-disc list-inside">
                    {recipe.ingredients.length > 0 ? (
                      recipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="font-serif">{ing}</li>
                      ))
                    ) : (
                      <li>Ingredients not found.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
