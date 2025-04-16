import React from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  const navigate = (path) => {
    router.push(path);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
        <div className="text-3xl font-bold text-black lobster-font">
          CalorieCraft!
        </div>
        <ul className="flex space-x-6">
          <li
            className="text-lg font-medium text-black cursor-pointer hover:text-green-600 poppins-font"
            onClick={() => navigate("/")}
          >
            Home
          </li>
          <li
            className="text-lg font-medium text-black cursor-pointer hover:text-green-600 poppins-font"
            onClick={() => navigate("/recipes")}
          >
            Recipes
          </li>
          <li
            className="text-lg font-medium text-black cursor-pointer hover:text-green-600 poppins-font"
            onClick={() => navigate("/about")}
          >
            Search
          </li>
          <li
            className="text-lg font-medium text-black cursor-pointer hover:text-green-600 poppins-font"
            onClick={() => navigate("/contact")}
          >
            Analyze
          </li>
        </ul>
      </nav>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Poppins:wght@400;600&display=swap');

          .lobster-font {
            font-family: 'Lobster', cursive;
          }

          .poppins-font {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
