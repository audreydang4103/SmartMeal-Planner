export const AVAILABLE_TAGS = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "quick", label: "Quick & Easy" },
  { id: "dessert", label: "Dessert" },
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "gluten-free", label: "Gluten Free" },
  { id: "low-carb", label: "Low Carb" },
  { id: "high-protein", label: "High Protein" },
]

import type { Recipe } from "@/lib/types"
import recipes from "@/data/recipes.json"

export const RECIPES = recipes as Recipe[]

