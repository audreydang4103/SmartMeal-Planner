## SmartMeal Planner

**SmartMeal Planner** is a full-featured web application that streamlines the entire meal planning process—from discovering new recipes to organizing a grocery list. Whether you're cooking for one or feeding a family, SmartMeal Planner helps you figure out what to buy with less effort.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Firebase, Vite, Spoonacular API

---

## Features

- **Recipe Discovery**  
  Browse 69+ curated recipes from the Spoonacular API with beautiful visuals. Filter recipes by tags such as *vegan*, *vegetarian*, *gluten-free*, or *quick & easy*. Each recipe includes cooking time, servings, ingredients, and step-by-step instructions.

- **Favorites & Custom Recipes**  
  Save and organize your favorite recipes with persistent localStorage. Create your own custom recipes with ingredients, steps, and dietary tags. Easily edit or delete your own recipes.

- **Smart Shopping Cart**  
  Add multiple recipes and automatically combine overlapping ingredients. Check off items while shopping. Adjust servings to dynamically update quantities. Export a clean, printable PDF grocery list in one click.

- **User Authentication**  
  Secure sign-up/sign-in with Firebase Email/Password Authentication. Personalized experience across sessions.

- **Modern UI/UX**  
  Built with Tailwind CSS and shadcn/ui. Fully responsive layout supports desktop, tablet, and mobile. Supports dark/light themes. Smooth navigation and real-time visual feedback using React Router and toast notifications.

---
## Walkthrough

---

## Installation

Clone and run the app locally in just a few steps:

```bash
git clone https://github.com/yourusername/smartmeal-planner.git
cd smartmeal-planner
npm install
npm run dev
