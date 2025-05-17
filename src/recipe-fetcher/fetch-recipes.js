require("dotenv").config()
const axios = require("axios")
const fs = require("fs")

const API_KEY = process.env.SPOONACULAR_API_KEY
const NUM_FETCH = 69
const OUTPUT_FILE = "recipes.json"

function extractTags(r) {
  const tags = []

  if (r.readyInMinutes <= 30) tags.push("quick")
  if (r.diets.includes("vegan")) tags.push("vegan")
  if (r.diets.includes("vegetarian")) tags.push("vegetarian")
  if (r.diets.includes("gluten-free")) tags.push("gluten-free")

  if (r.nutrition?.nutrients) {
    const nutrients = r.nutrition.nutrients
    const protein = nutrients.find((n) => n.name === "Protein")?.amount || 0
    const carbs = nutrients.find((n) => n.name === "Carbohydrates")?.amount || 0

    if (protein >= 20) tags.push("high-protein")
    if (carbs <= 20) tags.push("low-carb")
  }

  return tags
}

async function fetchRecipeDetail(id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${API_KEY}`
  const res = await axios.get(url)
  return res.data
}

async function fetchRecipes() {
  const searchUrl = `https://api.spoonacular.com/recipes/complexSearch?number=${NUM_FETCH}&instructionsRequired=true&apiKey=${API_KEY}`
  try {
    const response = await axios.get(searchUrl)
    const ids = response.data.results.map((r) => r.id)

    const recipes = []

    for (const id of ids) {
      const r = await fetchRecipeDetail(id)

      if (!r.analyzedInstructions?.[0]?.steps?.length) continue

      recipes.push({
        id: r.id.toString(),
        title: r.title,
        description: "",
        image: r.image,
        tags: extractTags(r),
        cookTime: r.readyInMinutes,
        servings: r.servings,
        ingredients: r.extendedIngredients.map((i) => ({
          amount: i.measures.us.amount?.toString() || "1",
          unit: i.measures.us.unitShort || "",
          name: i.name,
        })),
        instructions: r.analyzedInstructions[0].steps.map((s) => s.step),
      })
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(recipes, null, 2))
    console.log(`✅ Saved ${recipes.length} recipes to ${OUTPUT_FILE}`)
  } catch (err) {
    console.error("❌ Error fetching recipes:", err.message)
  }
}

fetchRecipes()
