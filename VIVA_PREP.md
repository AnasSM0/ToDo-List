# To-Do List Project Viva Preparation

This document explains the Simplified To-Do List Application codebase. The project implements a clean, easy-to-understand **PERN Stack** (Postgres, Express, React, Node) without complex abstractions.

## 1. Technology Stack

-   **Frontend**: React (Vite) + Tailwind CSS + shadcn/ui.
-   **Backend**: Node.js + Express.js.
-   **Database**: PostgreSQL (NeonDB).
-   **Communication**: REST API (using standard `fetch`).

## 2. Project Structure

### Backend (`/backend`)

The backend is a simple API Server.

*   `src/app.ts`: The entry point. It configures the server, sets up CORS (to allow frontend connection), and mounts the routes.
*   `src/db.ts`: Handles the database connection using `pg` (node-postgres). This is the "driver" that talks directly to the database.
*   `src/routes/taskRoutes.ts`: Contains ALL the logic for the Tasks.
    *   **GET /**: Runs `SELECT * FROM "Task"` to get all tasks.
    *   **POST /**: Runs `INSERT INTO "Task"` to create a new task.
    *   **PUT /:id**: Runs `UPDATE "Task"` to change title, description, or status.
    *   **DELETE /:id**: Runs `DELETE FROM "Task"` to remove a task.
    *   **Note**: We use **Parameterized Queries** (e.g., `$1`, `$2`) to prevent SQL Injection attacks. This is a critical security best practice.

### Frontend (`/frontend`)

The frontend is a React Single Page Application (SPA).

*   `src/main.tsx`: The starting point that renders the `App` component.
*   `src/components/TaskDashboard.tsx`: The main component containing the entire UI.
    *   **State Management**: We use `useState` to store the list of tasks, loading state, and form inputs.
    *   **Side Effects**: We use `useEffect` to fetch tasks from the backend when the page loads.
    *   **API Calls**: We use the native browser `fetch` API to talk to the backend.
    *   **Optimistic Updates**: When you check a box, we update the UI immediately to make it feel fast, then send the request to the server in the background.

## 3. Key Concepts for Viva

**Q: Why did you choose this stack?**
A: It provides a perfect balance of performance and simplicity. React offers a reactive UI, while Node/Express provides a lightweight and fast backend. Postgres is a robust relational database ideal for structured data like tasks.

**Q: How does the frontend talk to the backend?**
A: Through HTTP requests (GET, POST, PUT, DELETE) sent to `http://localhost:5000/api/tasks`.

**Q: How do you handle database security?**
A: By using "Parameterized Queries" in the SQL statements. This ensures that user input is never executed as code, preventing SQL Injection.

**Q: Where is the ORM?**
A: We intentionally avoided an ORM to keep the code lightweight and transparent. Writing raw SQL gives us full control over the queries and removes "magic" abstractions, making it easier to debug and understand exactly what is happening.

**Q: How do you handle errors?**
A: On the backend, we use `try/catch` blocks around our async database calls. If something fails, we log it and send a 500 status code. On the frontend, we catch these errors and display a friendly message to the user.

## 4. Database Schema

The database consists of a single table `Task`:

```sql
CREATE TABLE "Task" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "completed" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```
