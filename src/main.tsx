import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddRecipe from "./pages/AddRecipe";
import FavoritesPage from "./pages/Favorites";
import CartPage from "./pages/Cart";
import RecipeDetail from "./pages/RecipeDetail";
import Home from "./pages/Home";
import "./index.css";
import LoginPage from "@/pages/LoginPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


