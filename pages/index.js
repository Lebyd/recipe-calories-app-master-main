import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { useRouter } from "next/router";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export default function Home() {
  const [randomizedRecipes, setRandomizedRecipes] = useState([]);
  const router = useRouter();

  const predefinedRecipes = [
    "Creamy Meatballs & Pasta",
    "Sweet And Spicy Barbecue Wings",
    "Fresh Pesto Pasta With Peas",
    "Grilled Garlic Chicken & Veggies",
    "Shrimp Salad With Lettuce Corn",
    "Stir-Fried Egg With Thai Basil And Chilli",
    "Chicken Alfredo Pasta",
    "Beef Stir-Fry With Vegetables",
    "Vegetable Tacos",
  ];

  const shuffle = (array) => array.sort(() => Math.random() - 0.5).slice(0, 6);

  useEffect(() => {
    
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const fetchRecipeData = async () => {
      const recipePromises = shuffle(predefinedRecipes).map(async (recipe) => {
        try {
          const response = await fetch(
            `https://api.calorieninjas.com/v1/nutrition?query=${recipe}`,
            {
              headers: {
                "X-Api-Key": "bEl9tR2HLYL5bOs2AG5X4g==dHGLeAEQG9mRSViJ",
              },
            }
          );
          const data = await response.json();

          const round = (items, key) =>
            items?.reduce((sum, item) => sum + (item[key] || 0), 0).toFixed(1) || "N/A";

          const totalCalories = round(data.items, "calories");
          const totalServingSize = round(data.items, "serving_size_g");
          const totalProtein = round(data.items, "protein_g");

          let imageUrl = "https://via.placeholder.com/100";
          try {
            const imageRes = await fetch(
              `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                recipe
              )}&per_page=1&client_id=zFqGmqznz7V5dWru5g1d315FEtkEgMRY0TNa61g8kpw`
            );
            const imageData = await imageRes.json();
            if (imageData.results?.length > 0) {
              imageUrl = imageData.results[0].urls.regular;
            }
          } catch (err) {
            console.warn("Image fallback for:", recipe);
          }

          return {
            title: recipe,
            totalCalories: `${totalCalories} Calories`,
            totalServingSize: `${totalServingSize}g Serving`,
            totalProtein: `${totalProtein}g Protein`,
            img: imageUrl,
          };
        } catch (err) {
          console.error("Error fetching recipe:", recipe, err);
          return null;
        }
      });

      const recipesData = await Promise.all(recipePromises);
      setRandomizedRecipes(recipesData.filter(Boolean));
    };

    fetchRecipeData();

    
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={`${playfairDisplay.variable} h-screen`}>
      <div
        className="relative h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center px-4 text-white">
          
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Healthy Cooking Recipes <br /> and the Right Nutrition.
            </h1>
            <p className="text-gray-300 mt-3 text-lg">
              Browse Through Over 100,000+ Tasty Recipes.
            </p>
            <button
              onClick={() => router.push("/recipes")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg mt-5"
            >
              MORE RECIPES
            </button>
          </div>

          
          <div className="w-full max-w-6xl overflow-hidden px-4 flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {randomizedRecipes.map((recipe, index) => (
                <div
                  key={index}
                  className="relative group bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300"
                >
                  <img
                    src={recipe.img}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 group-hover:opacity-90 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="text-2xl font-bold text-white text-center">{recipe.title}</h2>
                    <p className="text-sm text-white text-center">{recipe.totalServingSize}</p>
                    <p className="text-sm text-green-300 text-center">{recipe.totalCalories}</p>
                    <p className="text-sm text-blue-300 text-center">{recipe.totalProtein}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
