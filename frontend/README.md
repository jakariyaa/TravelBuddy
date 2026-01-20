# Travner - Frontend Client

The modern web interface for Travner, built with **Next.js 16**, **Redux Toolkit**, and **Tailwind CSS**.

## 🏗️ Project Structure

```text
frontend/
├── app/
│   ├── (auth)/            # Auth routes (Login, Register)
│   ├── (user)/            # User routes (Profile)
│   ├── components/        # Reusable UI components (Navbar, Cards)
│   ├── utils/             # Helpers & API clients
│   └── layout.tsx         # Root layout & Providers
├── lib/
│   └── redux/             # State Management
│       ├── services/      # RTK Query API slices
│       ├── slices/        # Global Redux slices
│       └── store.ts       # Store configuration
└── public/                # Static assets
```

## 🧠 State Management (Redux Toolkit)

We utilize **RTK Query** for efficient server-state management.

-   **`apiSlice.ts`**: The central API definition. It handles base queries, authentication headers, and automatic caching/invalidation.
-   **`store.ts`**: The Redux store configuration.
-   **Typed Hooks**: `useAppDispatch` and `useAppSelector` are pre-typed for TypeScript safety.

## 🎨 Styling & Theming

-   **Framework**: Tailwind CSS (v4)
-   **Design System**: Custom color palette (Teal/Emerald primary) defined in `globals.css`.
-   **Icons**: Lucide React for modern, scalable SVG icons.
-   **UI Components**: We prioritize building composable components (e.g., `TravelPlanCard`, `EditProfileModal`) over using a heavy component library.

## ⚙️ Environment Configuration

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend API Endpoint | `http://localhost:5000/api` |
| `BETTER_AUTH_URL` | Auth Service URL | `http://localhost:5000` |

## 🚀 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the development server with TurboPack. |
| `npm run build` | Build the application for production. |
| `npm run start` | Start the production server. |
| `npm run lint` | Run ESLint to check for code quality issues. |

## 📦 Key Dependencies

-   **framer-motion**: For smooth layout animations and transitions.
-   **sonner**: For non-blocking, reliable toast notifications.
-   **better-auth/client**: For handling client-side authentication sessions.
