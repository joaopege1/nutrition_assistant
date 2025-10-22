# RCU App - Food Tracking

[](https://opensource.org/licenses/MIT)
[](https://react.dev/)
[](https://fastapi.tiangolo.com/)
[](https://www.typescriptlang.org/)
[](https://www.sqlite.org/index.html)

This application was developed to assist individuals with intestinal conditions, such as Crohn's disease, who need to relearn their dietary habits after diagnosis. It enables users to test their favorite foods to determine if they are safe for consumption.

By maintaining simple lists of **safe** and **unsafe** foods, the app simplifies the creation of tailored meal plans and structured diets. This is my first complete personal project, built independently from the ground up.

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
| | [SQLite](https://www.sqlite.org/index.html) | Serverless, self-contained database engine. |
| **Authentication** | [JWT](https://jwt.io/) / `python-jose` | Secure token-based authentication. |
| | `passlib[bcrypt]` | Secure password hashing. |
| **Deployment** | [Render](https://render.com/) | Cloud platform for deploying web apps. |

-----

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

  * [Node.js](https://nodejs.org/) (v18 or newer)
  * [Python](https://www.python.org/) (v3.9 or newer)
  * `npm` or `yarn`

### 1\. Backend Setup (API)

First, clone the repository and set up the backend server.

```bash
# Clone the repository (if you haven't)
git clone https://github.com/your-username/rcu-app.git
cd rcu-app

# Navigate to the backend directory (adjust if needed)
# cd backend/

# Install Python dependencies
pip install fastapi uvicorn sqlalchemy "python-jose[cryptography]" "passlib[bcrypt]"

# Run the FastAPI server
# This will start the server on http://localhost:8000
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Note:** Ensure your `auth.db` (SQLite database) is initialized as per your backend's logic (FastAPI/SQLAlchemy models).

### 2\. Frontend Setup (Client)

In a separate terminal, navigate to the frontend directory and install its dependencies.

```bash
# Navigate to the frontend app
cd frontend/my-react-app

# Install npm packages
npm install

# Run the frontend development server
# This will start the app on http://localhost:5173 (or similar)
npm run dev
```

The application should now be running and connected to your local backend.

-----

## ☁️ Deployment

This project is configured for easy deployment on **Render**.

### Render (Recommended)

The repository includes a `render.yaml` file. You can deploy both the frontend and backend automatically by following these steps:

1.  Push your code to your GitHub repository.
2.  In the Render Dashboard, create a new **Blueprint**.
3.  Select your repository.
4.  Render will read the `render.yaml` file and automatically configure the services.
5.  Click **"Apply"** to deploy.

For more detailed instructions, see `DEPLOYMENT.md`.

### Manual Deployment

1.  **Build Frontend:**
    ```bash
    cd frontend/my-react-app
    npm run build
    ```
2.  Serve the static files from the `dist/` folder using a static host.
3.  Deploy the backend (FastAPI application) to a service like Render, ensuring the frontend has the correct API URL.

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

Contributions are welcome\! If you'd like to help improve the RCU App, please follow these steps:

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

-----

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
