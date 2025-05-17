import React from "react"
import { Link } from "react-router-dom"
import { Tag, ShoppingCart, Heart, Plus } from "lucide-react"
import { Button } from "../components/ui/button"
import RecipeGallery from "../components/recipe-gallery"
import TagFilter from "../components/tag-filter"

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Recipe Finder</h1>
                    <p className="text-muted-foreground">Discover, organize, and shop for recipes</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/cart">
                        <Button variant="outline" size="icon">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Shopping Cart</span>
                        </Button>
                    </Link>
                    <Link to="/favorites">
                        <Button variant="outline" size="icon">
                            <Heart className="h-5 w-5" />
                            <span className="sr-only">Favorites</span>
                        </Button>
                    </Link>
                    <Link to="/add-recipe">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Recipe
                        </Button>
                    </Link>
                </div>
            </header>

            <main>
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Tag className="mr-2 h-5 w-5" />
                        Filter by Tags
                    </h2>
                    <TagFilter />
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Recipes</h2>
                    <RecipeGallery />
                </section>
            </main>
        </div>
    )
}