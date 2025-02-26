# Food Recipe Website - Project Context

## Overview
A website that helps users find recipes based on available ingredients and food types. The project uses Supabase for database and authentication, following a two-phase development approach.

## Domain Models

### User
- `userID`: string
- `username`: string 
- `email`: string
- `favorites`: Favorite[] (optional)

### Recipe
- `recipeID`: string
- `title`: string
- `description`: string
- `instructions`: string[]
- `imageURL`: string
- `foodType`: string
- `ingredients`: RecipeIngredient[] (optional)

### Ingredient
- `ingredientID`: string
- `name`: string

### RecipeIngredient
- `recipeID`: string
- `ingredientID`: string
- `measurement`: string (e.g., "2 cups", "300g")

### Favorite
- `favoriteID`: string
- `userID`: string
- `recipeID`: string
- `savedAt`: Date

## Project Configuration

### Food Types
- Italian
- Asian
- Mexican
- American
- Mediterranean
- Indian
- Healthy
- Vegetarian
- Vegan
- Dessert

### Constants
- Maximum ingredients selection: 10
- Recipes per page: 12

## Core Functionality

### User Management
- Set current user
- View user profile
- Manage favorites

### Recipe Search
- Add/remove ingredients
- Set food type
- Search recipes based on ingredients and food type
- Toggle recipe favorites

## Development Phases

### Phase 1: Frontend Development
- Build visually impressive and interactive UI
- Implement key features:
  - User registration/login
  - Ingredient selection
  - Food type filtering
  - Recipe display

### Phase 2: Backend Integration & Refinement
- Connect frontend to Supabase backend
- Develop recipe matching logic
- Ensure bug-free functionality

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router

### Backend
- Supabase
- PostgreSQL

### Testing
- Jest
- Cypress

## Key Features
1. User authentication
2. Ingredient selection
3. Food type filtering
4. Recipe matching
5. Favorite recipes
6. Step-by-step instructions
7. Responsive design

## Project Structure
The application will use React Context for state management with the following structure:

### Context Provider
Manages application state including:
- Current user
- Selected ingredients
- Selected food type
- Search functionality
- Favorite management

### Components
Will be organized into:
- Authentication components
- Recipe search and filtering
- Recipe display
- User dashboard
- Common UI elements

## Database Schema
Implemented in Supabase with the following tables:
1. users (managed by Supabase Auth)
2. recipes
3. ingredients
4. recipe_ingredients (junction table)
5. favorites

## Next Steps

1. Set up project with Create React App
2. Implement basic routing
3. Create authentication components
4. Develop recipe search interface
5. Integrate with Supabase 