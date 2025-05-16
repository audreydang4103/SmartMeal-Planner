import type { Ingredient, CartItem } from "./types"

export type IngredientKey = string
export type IngredientMap = Record<IngredientKey, CartItem>

function getCartMap(): IngredientMap {
  return JSON.parse(localStorage.getItem("cartMap") || "{}")
}

function saveCartMap(cart: IngredientMap) {
  localStorage.setItem("cartMap", JSON.stringify(cart))
}

export function getCart(): CartItem[] {
  return Object.values(getCartMap()).map((item) => ({
    ...item,
    amount: item.amount.toString(), 
  }))
}

function getKey(name: string, unit: string) {
  return `${name.toLowerCase()}|${unit.toLowerCase()}`
}

export function addRecipeToCart(ingredients: Ingredient[], recipeId?: string) {
  const cart = getCartMap()

  for (const ing of ingredients) {
    const key = getKey(ing.name, ing.unit)
    const delta = parseFloat(ing.amount) || 0

    if (!cart[key]) {
      cart[key] = {
        name: ing.name,
        unit: ing.unit,
        amount: delta.toString(),
        checked: false,
      }
    } else {
      const current = parseFloat(cart[key].amount) || 0
      cart[key].amount = (current + delta).toString()
    }
  }

  if (recipeId) {
    const map = JSON.parse(localStorage.getItem("cartRecipeMap") || "{}")
    map[recipeId] = (map[recipeId] || 0) + 1
    localStorage.setItem("cartRecipeMap", JSON.stringify(map))
  }

  saveCartMap(cart)
}


export function removeRecipeFromCart(ingredients: Ingredient[], recipeId?: string) {
  const cart = getCartMap()
  for (const ing of ingredients) {
    const key = getKey(ing.name, ing.unit)
    const delta = parseFloat(ing.amount) || 0
    if (cart[key]) {
      const current = parseFloat(cart[key].amount) || 0
      const newAmount = current - delta
      if (newAmount > 0) {
        cart[key].amount = newAmount.toString()
      } else {
        delete cart[key]
      }
    }
  }
  saveCartMap(cart)

  if (recipeId) {
    const stored = JSON.parse(localStorage.getItem("cartRecipeMap") || "{}")
    if (stored[recipeId] > 1) {
      stored[recipeId]--
    } else {
      delete stored[recipeId]
    }
    localStorage.setItem("cartRecipeMap", JSON.stringify(stored))
  }
}

export function toggleIngredientCheck(key: string) {
  const cart = getCartMap()
  if (cart[key]) {
    cart[key].checked = !cart[key].checked
    saveCartMap(cart)
  }
}

export function clearCart() {
  localStorage.removeItem("cartMap")
  localStorage.removeItem("cartRecipeMap")
}

export function getCartMapObject(): IngredientMap {
  return getCartMap()
}

export function getRecipeCounts(): Record<string, number> {
  return JSON.parse(localStorage.getItem("cartRecipeMap") || "{}")
}
