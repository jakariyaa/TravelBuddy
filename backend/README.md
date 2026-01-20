# Travner - Backend API

The robust RESTful API powering the Travner platform. Built with **Express.js**, **Prisma**, and **PostgreSQL**.

## 🏗️ Project Structure

```text
backend/
├── prisma/
│   ├── schema.prisma      # Database schema definition
│   └── seed.ts            # (Optional) Database seeding script
├── src/
│   ├── controllers/       # Request handlers (User, TravelPlan)
│   ├── lib/               # Configuration (Auth, Prisma Client)
│   ├── middleware/        # Auth guards, Error handling
│   ├── routes/            # API Route definitions
│   ├── utils/             # Helpers (Email, Logger)
│   └── index.ts           # Server entry point
└── package.json
```

## ⚙️ Environment Configuration

Ensure your `.env` file is configured with the following:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for PostgreSQL | `postgresql://user:pass@localhost:5432/travelbuddy` |
| `PORT` | Server listening port | `5000` |
| `BETTER_AUTH_SECRET` | Secret key for session encryption | `your-secret-key` |
| `BETTER_AUTH_URL` | Base URL of the backend | `http://localhost:5000` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_USER` | Email user | `user@example.com` |
| `SMTP_PASS` | Email password | `app-specific-password` |

## 📐 Database Schema

A simplified view of our core data models using Prisma:

```mermaid
erDiagram
    User ||--o{ TravelPlan : creates
    User ||--o{ Review : writes
    User ||--o{ Session : has
    TravelPlan ||--o{ JoinRequest : receives
    
    User {
        String id
        String email
        String name
        Boolean emailVerified
        String[] interests
    }

    TravelPlan {
        String id
        String destination
        DateTime startDate
        Int budget
        String userId
    }

    Session {
        String id
        String token
        DateTime expiresAt
    }
```

## 🔌 API Endpoints

### Authentication (`/api/auth/*`)
Handled by Better Auth.
-   `POST /api/auth/sign-up/email`: Register new user.
-   `POST /api/auth/sign-in/email`: Login with password.
-   `POST /api/auth/sign-in/social`: Login with OAuth providers.

### Users (`/api/users`)
| Method | Endpoint | Secured | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/profile` | ✅ | Get the verified user's profile. |
| `PUT` | `/profile` | ✅ | Update user details (Bio, Interests). |
| `GET` | `/search` | ❌ | Search for other users. |

### Travel Plans (`/api/travel-plans`)
| Method | Endpoint | Secured | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | ❌ | List all travel plans (Supports filtering). |
| `POST` | `/` | ✅ | Create a new travel plan. |
| `GET` | `/:id` | ❌ | Get details of a specific plan. |
| `POST` | `/:id/join` | ✅ | Request to join a plan. |

## 🚀 Development & Deployment

**Run Locally:**
```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```
*Note: Make sure to run migrations (`npx prisma migrate deploy`) in your production environment.*
