import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Heart } from "lucide-react"
import { Button } from "./ui/button"
import { RECIPES } from "../lib/recipe-data"
import { Link } from "react-router-dom"

export default function RecipeGallery() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const tagFilter = searchParams.get("tags")?.split(",") || []

  const filteredRecipes =
    tagFilter.length > 0
      ? RECIPES.filter((recipe) => recipe.tags.some((tag) => tagFilter.includes(tag)))
      : RECIPES

  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const newFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id]

    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredRecipes.length === 0 ? (
        <p className="col-span-full text-center py-8 text-muted-foreground">
          No recipes match your selected tags. Try selecting different tags.
        </p>
      ) : (
        filteredRecipes.map((recipe) => (
          <Link to={`/recipes/${recipe.id}`} key={recipe.id}>
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full bg-muted flex items-center justify-center">
                {/* Replace with <img /> until Image component is available */}
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  className="object-cover w-full h-full"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 rounded-full"
                  onClick={(e) => toggleFavorite(recipe.id, e)}
                >
                  <Heart
                    className={`h-5 w-5 ${favorites.includes(recipe.id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span className="sr-only">Add to favorites</span>
                </Button>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg line-clamp-1">{recipe.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {recipe.description}
                </p>
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
        ))
      )}
    </div>
  )
}
