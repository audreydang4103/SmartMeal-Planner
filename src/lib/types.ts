export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  cookTime: number
  servings: number
  ingredients: Ingredient[]
  instructions: string[]
}

export interface Ingredient {
  amount: string
  unit: string
  name: string
}

export interface CartItem extends Ingredient {
  checked: boolean
}

export interface Tag {
  id: string
  label: string
}
