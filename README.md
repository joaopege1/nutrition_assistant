# Nutrition Assistant - Food Tracking

[](https://react.dev/)
[](https://fastapi.tiangolo.com/)
[](https://www.typescriptlang.org/)
[](https://www.sqlite.org/index.html)

This application was developed to assist individuals with intestinal conditions, such as Crohn's disease, who need to relearn their dietary habits after diagnosis. It enables users to test their favorite foods to determine if they are safe for consumption.

By maintaining simple lists of **safe** and **unsafe** foods, the app simplifies the creation of tailored meal plans and structured diets. This is my first complete personal project, built independently from the ground up.

This is the link for the production demo: https://rcu-app-frontend.onrender.com/

-----

## Features

### Authentication & Security

  * **Secure Login:** JWT-based authentication system.
  * **User Registration:** Ability to create new user or admin accounts.
  * **Protected Routes:** Role-based access control (User vs. Admin) to secure endpoints and views.
  * **HTTP Interceptors:** Axios is configured to automatically include the auth token in all requests.

### Food & Health Management

  * **Create Entries:** Add new food entries with name, quantity, and date.
  * **Safety Status:** Mark foods as `is_safe: true` or `is_safe: false` after a testing period.
  * **View Lists:** Display dynamically filtered lists of all "Safe" and "Unsafe" foods.
  * **CRUD Operations:** Full ability to edit and delete existing food entries.
  * **Health Tracking:** Log other critical information that may affect symptoms, including:
      * Medication intake
      * Exercise activity
      * Alcohol consumption
      * Unusual food consumption
      * Symptom details

### Statistics & Insights

  * **Dashboard Stats:** View total counts of safe and unsafe foods.
  * **Time-Based Filtering:** See statistics for different time periods (e.g., last 7 or 30 days).

### Responsive Design

  * **Mobile-First:** A clean, single-column layout optimized for small screens (`<= 480px`).
  * **Tablet View:** A two-column layout for medium-sized screens (`481px - 768px`).
  * **Desktop View:** A full, multi-column layout for larger screens (`>= 769px`).

-----

## Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [React 19](https://react.dev/) | Core UI library. |
| | [TypeScript](https://www.typescriptlang.org/) | Static typing for JavaScript. |
| | [React Router](https://reactrouter.com/) | Client-side routing and navigation. |
| | [Vite](https://vitejs.dev/) | Next-generation frontend build tool. |
| **State Mgmt** | [Context API](https://react.dev/reference/react/useContext) | Built-in state management. |
| **HTTP Client** | [Axios](https://axios-http.com/) | Promise-based HTTP client for requests. |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) | High-performance Python API framework. |
| | [PostgreSQL](https://www.postgresql.org/) | Production database (SQLite for quick local tests). |
| **Authentication** | [JWT](https://jwt.io/) / `python-jose` | Secure token-based authentication. |
| | `passlib[bcrypt]` | Secure password hashing. |
| **Containers** | [Docker Compose](https://docs.docker.com/compose/) | One-command local dev environment. |
| **Deployment** | [Render](https://render.com/) + [Neon](https://neon.tech/) + [Vercel](https://vercel.com/) | Backend, database, and frontend — all free tier. |

-----

## Getting Started

The whole stack (backend + Postgres + frontend) runs via Docker Compose. You only need Docker installed locally.

### Prerequisites

  * [Docker](https://www.docker.com/) (with Compose v2)

### Run locally

```bash
git clone https://github.com/your-username/rcu-app.git
cd rcu-app

cp .env.example .env       # adjust if you want different DB credentials
docker compose up --build
```

This starts:

| Service    | URL                          | Notes                              |
| :--------- | :--------------------------- | :--------------------------------- |
| Frontend   | http://localhost:5173        | Vite dev server, hot reload        |
| Backend    | http://localhost:8000        | FastAPI with `--reload`            |
| Postgres   | localhost:5432               | Data persisted in `postgres_data`  |

The backend auto-creates its tables on first boot. To stop and wipe everything: `docker compose down -v`.

-----

## ☁️ Deployment

The free-tier, no-credit-card stack:

| Piece     | Service                                                             |
| :-------- | :------------------------------------------------------------------ |
| Database  | [Neon](https://neon.tech) (Postgres, 3 GB free)                     |
| Backend   | [Render](https://render.com) (Web Service free tier, Docker runtime)|
| Frontend  | [Vercel](https://vercel.com) (Hobby plan, free)                     |

### 1. Database — Neon

1. Sign up at https://neon.tech (GitHub login, no card).
2. Create a project. Copy the **Pooled connection string** (looks like
   `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require`).
3. Keep it open — you'll paste it into Render next.

### 2. Backend — Render

1. Sign up at https://render.com (GitHub login, no card for free tier).
2. Push this repo to GitHub.
3. In Render → **New** → **Blueprint** → select your repo. It picks up `render.yaml`
   and creates the `rcu-app-api` service from `backend/Dockerfile`.
4. In the service's **Environment** tab, set the three secrets marked
   `sync: false`:
   - `DATABASE_URL` — the Neon connection string from step 1.
   - `SECRET_KEY` — generate with `python -c "import secrets; print(secrets.token_hex(32))"`.
   - `FRONTEND_URL` — leave blank for now; fill it after deploying Vercel.
5. Deploy. Note the public URL (something like `https://rcu-app-api.onrender.com`).

> Render's free Web Service sleeps after ~15 min idle (cold start ~50 s on next
> request). To keep it warm, point a free [UptimeRobot](https://uptimerobot.com)
> monitor at `/health` every 5 min.

### 3. Frontend — Vercel

1. Sign up at https://vercel.com (GitHub login, no card).
2. **New Project** → import the same repo.
3. Vercel auto-detects Vite. Set the **Root Directory** to `frontend/my-react-app`.
4. Under **Environment Variables**, add `VITE_API_URL` = your Render backend URL
   (`https://rcu-app-api.onrender.com`).
5. Deploy. Copy the Vercel URL.

### 4. Wire frontend back into backend CORS

Back in Render, set `FRONTEND_URL` = your Vercel URL and redeploy. Done.

-----

## User Roles

The application supports two distinct user roles with different permissions.

### Regular User

  * Can create, view, edit, and delete their **own** food entries.
  * Can view their personal safe/unsafe food lists.
  * Can view their personal statistics.

### Administrator

  * Has all capabilities of a regular user.
  * Can view, edit, and delete **all** food entries in the system.
  * Can update the safety status of any food entry.

-----

## Roadmap (Future Enhancements)

  * **AI Agent:** Implement an AI-powered agent to suggest a food's likely safety status based on web research and user-provided symptom patterns.
  * **Notifications:** Add a notification system to remind users 24 hours after logging a new food to confirm its safety status.
  * **Advanced Health Tracking:** Build out the UI and database models for the planned medication, exercise, alcohol, and symptom tracking features.

-----

## 🤝 Contributing

Contributions are welcome\! If you'd like to help improve the Nutrition Assistant, please follow these steps:

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

-----

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) file for details.
