# 🌍 Travel Buddy

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19-blue)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

**Travel Buddy** is a comprehensive full-stack web application designed to banish the isolation of solo travel. It connects adventurous souls, facilitates collaborative trip planning, and provides a secure platform to find like-minded companions.

## 🚀 Live Demo

-   **Frontend Application**: [https://travelbuddy.jakariya.eu.org/](https://travelbuddy.jakariya.eu.org/)
-   **Backend API**: [https://travelbuddy-server.jakariya.eu.org/](https://travelbuddy-server.jakariya.eu.org/)

---

## 🏛️ System Architecture

The application follows a modern decoupled architecture:

```mermaid
graph TD
    User[End User]
    
    subgraph Frontend [Frontend (Next.js 16)]
        UI[React UI]
        Redux[Redux Store]
        RTK[RTK Query]
    end
    
    subgraph Backend [Backend (Express + Node.js)]
        API[REST API]
        Auth[Better Auth]
        Prisma[Prisma ORM]
    end
    
    subgraph Database [Data Layer]
        PG[(PostgreSQL)]
    end
    
    subgraph External [External Services]
        Email[Nodemailer / SMTP]
        Social[Google / GitHub OAuth]
    end

    User -->|HTTPS| UI
    UI -->|Actions| Redux
    Redux -->|Async Thunks / Hooks| RTK
    RTK -->|Fetch API| API
    
    API -->|Validation| Auth
    API -->|Query| Prisma
    Prisma -->|SQL| PG
    
    Auth -->|OAuth| Social
    API -->|Send| Email
```

---

## ✨ Key Features

### 🔐 Advanced Authentication & Security
-   **Multi-Provider Login**: Seamless sign-in with Google, GitHub, or Email/Password.
-   **Strict Verification**: Email OTP verification is mandatory. Password recovery flow includes silent user checking to prevent enumeration attacks.
-   **Session Management**: Secure, persistent sessions utilizing Better Auth.

### 🗺️ Trip Planning & Discovery
-   **Infinite Feed**: Browse user-generated travel plans with high-performance infinite scrolling.
-   **Real-time Filtering**: Instantly filter trips by destination, budget range, and travel dates.
-   **Buddy Matching Algorithm**: Our system calculates a "Match Score" based on shared interests and visited countries to recommend the best travel partners.

### 👤 Profile & Social
-   **Detailed Profiles**: Showcase your bio, travel stats, and interests.
-   **Privacy Controls**: Secure password management and profile editing.
-   **Reputation System**: (Future functionality) Ratings and reviews for trust.

---

## 🛠️ Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 16** | The React Framework for the Web (App Router). |
| | **Redux Toolkit** | Modern state management with RTK Query for caching. |
| | **Tailwind CSS 4** | Utility-first CSS framework for rapid UI development. |
| | **Lucide React** | Beautiful, consistent icons. |
| **Backend** | **Express.js** | Fast, unopinionated, minimalist web framework for Node.js. |
| | **Prisma ORM** | Next-generation Node.js and TypeScript ORM. |
| | **Better Auth** | Comprehensive authentication library. |
| **Database** | **PostgreSQL** | Powerful, open source object-relational database system. |
| **DevOps** | **TypeScript** | Strongly typed JavaScript for scale. |
| | **Vercel** | (Frontend Deployment Target). |

---

## 🚀 Getting Started

To run the full application locally, you will need to start both the Frontend and Backend servers.

### 1. Repository Setup

Clone the repository:
```bash
git clone https://github.com/your-username/travel-buddy.git
cd travel-buddy
```

### 2. Backend Setup
Navigate to the backend directory and follow the [Backend README](./backend/README.md) to set up the database and environment variables.

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory and follow the [Frontend README](./frontend/README.md) to set up the client.

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application running.

---

## 🤝 Contribution

We welcome contributions! Please follow these steps:
1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
