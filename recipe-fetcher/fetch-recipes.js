require("dotenv").config()
const axios = require("axios")
const fs = require("fs")

const API_KEY = process.env.SPOONACULAR_API_KEY
const NUM_FETCH = 30 // số lượng lớn để lọc bớt
const OUTPUT_FILE = "recipes.json"

// Gọi chi tiết từng món
async function fetchRecipeDetail(id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${API_KEY}`
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

      // Bỏ qua món không có bước nấu
      if (!r.analyzedInstructions?.[0]?.steps?.length) continue

      recipes.push({
        id: r.id.toString(),
        title: r.title,
        description: "", // Nếu muốn giữ phần tóm tắt: r.summary.replace(/<[^>]*>?/gm, "")
        image: r.image,
        tags: [r.dishTypes?.[0], r.diets?.[0]].filter(Boolean),
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
