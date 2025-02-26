# Kitchen Chef - Recipe Search Application

A modern web application that helps users find recipes based on available ingredients and food types. Built with React, TypeScript, and Supabase.

## Features

- User authentication and profiles
- Ingredient-based recipe search
- Food type filtering
- Favorite recipes management
- Responsive, modern UI
- Dark mode support

## Tech Stack

- React.js with TypeScript
- Tailwind CSS for styling
- Supabase for backend and authentication
- React Router for navigation
- Framer Motion for animations
- DaisyUI for UI components

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd kitchen-chef
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Database Setup

1. Create a new Supabase project
2. Set up the following tables:

### Users Table
- id (uuid, primary key)
- username (text)
- email (text)
- created_at (timestamp)

### Recipes Table
- id (uuid, primary key)
- title (text)
- description (text)
- instructions (json)
- image_url (text)
- food_type (text)
- created_at (timestamp)

### Ingredients Table
- id (uuid, primary key)
- name (text)
- created_at (timestamp)

### Recipe_Ingredients Table
- recipe_id (uuid, foreign key)
- ingredient_id (uuid, foreign key)
- measurement (text)
- created_at (timestamp)

### Favorites Table
- id (uuid, primary key)
- user_id (uuid, foreign key)
- recipe_id (uuid, foreign key)
- created_at (timestamp)

## Project Structure

```
kitchen-chef/
├── src/
│   ├── components/    # Reusable UI components
│   ├── context/      # React Context providers
│   ├── lib/          # Utility functions and configurations
│   ├── pages/        # Page components
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
└── ...config files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Supabase](https://supabase.io/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [DaisyUI](https://daisyui.com/) for UI components
- [React Router](https://reactrouter.com/) for routing
- [Framer Motion](https://www.framer.com/motion/) for animations

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
