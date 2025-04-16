import { useState } from "react";

export default function Contact() {
  const [image, setImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("media", image);

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://api.calorieninjas.com/v1/imagetextnutrition", {
        method: "POST",
        headers: {
          "X-Api-Key": "bEl9tR2HLYL5bOs2AG5X4g==dHGLeAEQG9mRSViJ",
        },
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setAnalysisResult(data.items || []);
      }
    } catch (err) {
      setError("An error occurred while analyzing the image.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f7fa] via-[#f9fafb] to-white px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-4 font-serif text-black">
          Upload and Analyze Food Text Image
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-3 rounded-lg mb-4 border border-gray-300 w-full sm:w-96 text-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#111] text-white px-5 py-3 rounded-lg hover:bg-[#00cfff] hover:text-black transition"
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {analysisResult && analysisResult.length > 0 && !error && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 font-serif text-black text-center">
              Nutrition Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analysisResult.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-md shadow border border-gray-200 text-black"
                >
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Calories:</strong> {item.calories} kcal</p>
                  <p><strong>Serving Size:</strong> {item.serving_size_g} g</p>
                  <p><strong>Fat (Total):</strong> {item.fat_total_g} g</p>
                  <p><strong>Protein:</strong> {item.protein_g} g</p>
                  <p><strong>Carbs:</strong> {item.carbohydrates_total_g} g</p>
                  <p><strong>Sodium:</strong> {item.sodium_mg} mg</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysisResult && analysisResult.length === 0 && !error && (
          <p className="mt-4 text-black text-center">No nutrition data found in the image.</p>
        )}
      </div>
    </div>
  );
}
