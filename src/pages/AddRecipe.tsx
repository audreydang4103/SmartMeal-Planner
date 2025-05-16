import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AVAILABLE_TAGS } from "@/lib/recipe-data";

export default function AddRecipe() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState([{ amount: "", unit: "", name: "" }]);
  const [instructions, setInstructions] = useState([""]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { amount: "", unit: "", name: "" }]);
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Recipe submitted!",
      description: "Your recipe has been added successfully.",
    });
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-screen-xl mx-auto px-4">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to recipes
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-10">Add New Recipe</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Recipe Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                <Input id="cookTime" type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input id="servings" type="number" value={servings} onChange={(e) => setServings(e.target.value)} required />
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="image-upload">Recipe Image</Label>
              <Label htmlFor="image-upload" className="flex items-center justify-center h-32 border-2 border-dashed rounded-md cursor-pointer">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 w-6 h-6 text-gray-500" />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  </div>
                )}
                <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </Label>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Ingredients</Label>
                <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-end gap-2 mb-3">
                      <Input placeholder="Amount" value={ingredient.amount} onChange={(e) => updateIngredient(index, "amount", e.target.value)} required />
                      <Input placeholder="Unit" value={ingredient.unit} onChange={(e) => updateIngredient(index, "unit", e.target.value)} />
                      <Input placeholder="Ingredient" value={ingredient.name} onChange={(e) => updateIngredient(index, "name", e.target.value)} required />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)} disabled={ingredients.length === 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Instructions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                  <Plus className="h-4 w-4 mr-1" /> Add Step
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex items-center mb-1">
                        <Label htmlFor={`instruction-${index}`} className="text-xs">
                          Step {index + 1}
                        </Label>
                        <Button type="button" variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => removeInstruction(index)} disabled={instructions.length === 1}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Textarea id={`instruction-${index}`} value={instruction} onChange={(e) => updateInstruction(index, e.target.value)} placeholder={`Instruction step ${index + 1}`} required />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                Submit Recipe
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


