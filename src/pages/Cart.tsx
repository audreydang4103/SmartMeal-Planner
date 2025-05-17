import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Trash2, ShoppingCart, Minus, Plus, MoreHorizontal, Download } from "lucide-react"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"
import { RECIPES } from "../lib/recipe-data"
import { Badge } from "../components/ui/badge"
import jsPDF from "jspdf"

import {
    getCart,
    clearCart,
    toggleIngredientCheck,
    addRecipeToCart,
    removeRecipeFromCart,
    getRecipeCounts
} from "../lib/cart-utils"
import type { CartItem } from "../lib/types"

export default function ShoppingCartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [recipeCounts, setRecipeCounts] = useState<Record<string, number>>({})

    useEffect(() => {
        setCartItems(getCart())
        setRecipeCounts(getRecipeCounts())
    }, [])

    const handleClearCart = () => {
        clearCart()
        setCartItems([])
        setRecipeCounts({})
    }

    const handleToggleCheck = (item: CartItem) => {
        const key = `${item.name.toLowerCase()}|${item.unit.toLowerCase()}`
        toggleIngredientCheck(key)
        setCartItems(getCart())
    }

    const handleIncrease = (id: string) => {
        const recipe = RECIPES.find((r) => r.id === id)
        if (recipe) {
            addRecipeToCart(recipe.ingredients, recipe.id)
            setCartItems(getCart())
            setRecipeCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
        }
    }

    const handleDecrease = (id: string) => {
        const recipe = RECIPES.find((r) => r.id === id)
        if (recipe && recipeCounts[id] && recipeCounts[id] > 1) {
            removeRecipeFromCart(recipe.ingredients, recipe.id)
            setCartItems(getCart())
            setRecipeCounts((prev) => ({ ...prev, [id]: prev[id] - 1 }))
        } else if (recipe) {
            removeRecipeFromCart(recipe.ingredients, recipe.id)
            setCartItems(getCart())
            const updated = { ...recipeCounts }
            delete updated[id]
            setRecipeCounts(updated)
        }
    }

    const handleRemoveRecipe = (id: string) => {
        const recipe = RECIPES.find((r) => r.id === id)
        if (recipe) {
            for (let i = 0; i < recipeCounts[id]; i++) {
                removeRecipeFromCart(recipe.ingredients, recipe.id)
            }
            setCartItems(getCart())
            const updated = { ...recipeCounts }
            delete updated[id]
            setRecipeCounts(updated)
        }
    }


    function handleExportPDF() {
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.text("Grocery List", 20, 20)

        // Lấy danh sách từ DOM
        const items = document.querySelectorAll(".grocery-item-label")

        let y = 30
        items.forEach((item) => {
            doc.setFontSize(12)
            doc.text(`• ${item.textContent || ""}`, 20, y)
            y += 10
        })

        doc.save("grocery-list.pdf")
    }


    const recipesInCart = Object.keys(recipeCounts)
        .map((id) => RECIPES.find((r) => r.id === id))
        .filter(Boolean) as typeof RECIPES

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                    <ShoppingCart className="mr-3 h-6 w-6" /> Shopping Cart
                </h1>
                <Button variant="outline" onClick={handleClearCart} disabled={cartItems.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
                </Button>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">Add ingredients by choosing recipes</p>
                    <Button asChild>
                        <Link to="/">Browse Recipes</Link>
                    </Button>
                </div>
            ) : (
                <>
                    {recipesInCart.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-xl font-semibold mb-2">Recipes in Cart</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {recipesInCart.map((recipe) => (
                                    <div
                                        key={recipe.id}
                                        className="relative min-w-[200px] max-w-[200px] border rounded-md shadow-sm overflow-hidden"
                                    >
                                        <img
                                            src={recipe.image || "/placeholder.svg"}
                                            alt={recipe.title}
                                            className="w-full h-28 object-cover"
                                        />
                                        <div className="p-2">
                                            <h3 className="text-sm font-semibold line-clamp-1">{recipe.title}</h3>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {recipe.tags.slice(0, 2).map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-3 mt-2">


                                                <Button size="icon" variant="ghost" onClick={() => handleDecrease(recipe.id)}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>

                                                <span className="text-xs font-medium">x{recipeCounts[recipe.id]}</span>

                                                <Button size="icon" variant="ghost" onClick={() => handleIncrease(recipe.id)}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <div></div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-destructive"
                                                    onClick={() => handleRemoveRecipe(recipe.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Grocery List</h2>
                                <Button variant="ghost" className="text-sm text-muted-foreground hover:text-black" onClick={handleExportPDF}>
                                    <Download className="h-4 w-4 mr-1" />
                                    Export PDF
                                </Button>
                            </div>

                            <ul className="space-y-3">
                                {cartItems.map((item, index) => {
                                    const key = `${item.name.toLowerCase()}|${item.unit.toLowerCase()}`
                                    return (
                                        <li
                                            key={index}
                                            className="flex items-start justify-between rounded-lg bg-white px-4 py-2 shadow-sm"
                                        >
                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id={`item-${index}`}
                                                    checked={item.checked}
                                                    onCheckedChange={() => handleToggleCheck(item)}
                                                />
                                                <label
                                                    htmlFor={`item-${index}`}
                                                    className={`grocery-item-label text-sm leading-6 ${item.checked ? "line-through text-muted-foreground" : ""}`}                                                >
                                                    {item.amount} {item.unit} {item.name}
                                                </label>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
