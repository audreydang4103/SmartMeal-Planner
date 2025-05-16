import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

const AVAILABLE_TAGS = [
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

export default function TagFilter() {
  const location = useLocation()
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const currentTags = searchParams.get("tags")?.split(",") || []

  const toggleTag = (tagId: string) => {
    let newTags: string[]

    if (currentTags.includes(tagId)) {
      newTags = currentTags.filter((t) => t !== tagId)
    } else {
      newTags = [...currentTags, tagId]
    }

    if (newTags.length > 0) {
      searchParams.set("tags", newTags.join(","))
    } else {
      searchParams.delete("tags")
    }

    navigate({ pathname: location.pathname, search: `?${searchParams.toString()}` })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {AVAILABLE_TAGS.map((tag) => (
        <Badge
          key={tag.id}
          variant={currentTags.includes(tag.id) ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => toggleTag(tag.id)}
        >
          {tag.label}
        </Badge>
      ))}
    </div>
  )
}