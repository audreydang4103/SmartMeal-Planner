import React, { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Heart, ShoppingCart, Clock, Users } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { useToast } from "../hooks/use-toast"
import { RECIPES } from "../lib/recipe-data"
import { addRecipeToCart } from "../lib/cart-utils"

export default function RecipeDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { toast } = useToast()

    const recipe = RECIPES.find((r) => r.id === id)
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        setIsFavorite(storedFavorites.includes(id))
    }, [id])

    const toggleFavorite = () => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        let newFavorites

        if (isFavorite) {
            newFavorites = storedFavorites.filter((favId: string) => favId !== id)
            toast({ description: "Removed from favorites" })
        } else {
            newFavorites = [...storedFavorites, id]
            toast({ description: "Added to favorites" })
        }

        localStorage.setItem("favorites", JSON.stringify(newFavorites))
        setIsFavorite(!isFavorite)
    }

    const handleAddToCart = () => {
        if (recipe) {
            addRecipeToCart(recipe.ingredients, recipe.id)
            toast({ description: "Ingredients added to shopping cart" })
        }
    }

    if (!recipe) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
                <Button asChild>
                    <Link to="/home">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to recipes
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" asChild className="mb-4">
                <Link to="/home">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to recipes
                </Link>
            </Button>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden">
                    <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="object-cover w-full h-full" />
                </div>

                <div>
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold">{recipe.title}</h1>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleFavorite}
                            className={isFavorite ? "text-red-500" : ""}
                        >
                            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
                            <span className="sr-only">
                                {isFavorite ? "Remove from favorites" : "Add to favorites"}
                            </span>
                        </Button>
                    </div>

                    <p className="text-muted-foreground mt-2">{recipe.description}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {recipe.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-6">
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>{recipe.cookTime} mins</span>
                        </div>
                        <div className="flex items-center">
                            <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>{recipe.servings} servings</span>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Ingredients</h2>
                            <Button onClick={handleAddToCart}>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                            </Button>
                        </div>

                        <ul className="space-y-2">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Separator className="my-6" />

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                        <ol className="space-y-4">
                            {recipe.instructions.map((step, index) => (
                                <li key={index} className="flex">
                                    <span className="font-bold mr-2">{index + 1}.</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}
