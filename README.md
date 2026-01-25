# Attendance Management System

A simple HR management system for student workshop activities. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

✅ **View Members** - Display all members from the database in a clean table format
✅ **Add Members** - Add new members with name, category, email, and phone
✅ **Edit Members** - Modify member information
✅ **Delete Members** - Remove members from the system
✅ **Mark Attendance** - Track attendance with Present/Absent status
✅ **Filter by Category** - Filter members by Game or Graphics category
✅ **Search Members** - Search members by name
✅ **Responsive Design** - Works great on desktop and mobile devices

## Quick Start

### Option 1: Run Frontend and Backend Together (Recommended)

1. **Install all dependencies**

```bash
npm run install:all
```

2. **Start both servers**

```bash
npm run dev:all
```

This will start:
- Backend API on `http://localhost:3001`
- Frontend on `http://localhost:5173`

### Option 2: Run Separately

1. **Install dependencies**

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

2. **Start the servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

3. Open `http://localhost:5173` in your browser

## Available Scripts

### Root Directory

- **`npm run dev:all`** - Run both frontend and backend together
- **`npm run dev`** - Start only the frontend development server
- **`npm run dev:backend`** - Start only the backend server
- **`npm run install:all`** - Install dependencies for both frontend and backend
- **`npm run build:all`** - Build both frontend and backend for production
- **`npm run build`** - Build frontend for production
- **`npm run preview`** - Preview the production build
- **`npm run lint`** - Run ESLint to check code quality

### Backend Directory

- **`npm run dev`** - Start backend with hot reload
- **`npm run build`** - Build backend for production
- **`npm start`** - Run production build

## Project Structure

```
src/
├── components/          # React components
│   ├── MemberList.tsx   # Displays members in a table
│   ├── AddMember.tsx    # Form for adding/editing members
│   └── CategoryFilter.tsx # Filter and search controls
├── types/               # TypeScript type definitions
│   └── index.ts
├── api/                 # API service functions
│   └── memberService.ts
├── data/                # Mock data
│   └── mockData.ts
├── App.tsx              # Main app component
├── index.css            # Global styles with Tailwind directives
└── main.tsx             # App entry point
```

## Technology Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Database**: SQLite3 (for backend integration)

## Data Model

### Member

```typescript
interface Member {
  id: number;
  name: string;
  category: "game" | "graphics";
  email?: string;
  phone?: string;
  createdAt: string;
  attendanceToday?: "present" | "absent";
}
```

## Categories

- **Game** - Members in the Game development track
- **Graphics** - Members in the Graphics design track

## How to Use

### Adding a New Member

1. Click the **"Add Member"** button in the header
2. Fill in the form (Name is required)
3. Click **"Save"**

### Editing a Member

1. Click the **Edit** (✏️) button next to the member
2. Modify the information
3. Click **"Save"**

### Deleting a Member

1. Click the **Delete** (🗑️) button next to the member
2. Confirm the deletion

### Marking Attendance

- Click **"Present"** to mark as present (green button)
- Click **"Absent"** to mark as absent (red button)

### Filtering and Searching

- Use the **Category** dropdown to filter by Game or Graphics
- Use the **Search** box to find members by name

## Mock Data

The application comes with 8 sample members for demonstration purposes.

## Backend Integration

To connect to a real database, uncomment the API call in `src/App.tsx` and set up your backend to handle the API endpoints in `src/api/memberService.ts`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
  {
  files: ['**/*.{ts,tsx}'],
  extends: [
  // Other configs...

        // Remove tseslint.configs.recommended and replace with this
        tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        tseslint.configs.stylisticTypeChecked,

        // Other configs...
      ],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.node.json', './tsconfig.app.json'],
          tsconfigRootDir: import.meta.dirname,
        },
        // other options...
      },

  },
  ])

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
````
