import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RECIPES } from "@/lib/recipe-data"

export default function Favorites() {
    const [favorites, setFavorites] = useState<string[]>([])

    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites")
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites))
        }
    }, [])

    const favoriteRecipes = RECIPES.filter((recipe) => favorites.includes(recipe.id))

    const removeFromFavorites = (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const newFavorites = favorites.filter((fav) => fav !== id)
        setFavorites(newFavorites)
        localStorage.setItem("favorites", JSON.stringify(newFavorites))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" asChild className="mb-4">
                <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to recipes
                </Link>
            </Button>

            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <Heart className="mr-3 h-6 w-6 fill-red-500 text-red-500" />
                Favorite Recipes
            </h1>

            {favoriteRecipes.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-2">No favorite recipes yet</h2>
                    <p className="text-muted-foreground mb-6">Add recipes to your favorites to see them here</p>
                    <Button asChild>
                        <Link to="/">Browse Recipes</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favoriteRecipes.map((recipe) => (
                        <Link to={`/recipes/${recipe.id}`} key={recipe.id}>
                            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative h-48 w-full bg-muted">
                                    <img
                                        src={recipe.image || "/placeholder.svg"}
                                        alt={recipe.title}
                                        className="object-cover w-full h-full"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 bg-white/80 rounded-full"
                                        onClick={(e) => removeFromFavorites(recipe.id, e)}
                                    >
                                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                        <span className="sr-only">Remove from favorites</span>
                                    </Button>
                                </div>
                                <CardContent className="pt-4">
                                    <h3 className="font-semibold text-lg line-clamp-1">{recipe.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{recipe.description}</p>
                                </CardContent>
                                <CardFooter className="flex flex-wrap gap-1 pt-0">
                                    {recipe.tags.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {recipe.tags.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{recipe.tags.length - 3} more
                                        </Badge>
                                    )}
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
