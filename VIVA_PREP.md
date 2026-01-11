# 🎓 Ultimate Viva Preparation Guide: To-Do List Application

This document provides a complete breakdown of your PERN stack (Postgres, Express, React, Node) To-Do List application. It is designed to help you answer *any* question an examiner might throw at you.

---

## 1. Project Overview

**Project Name**: To-Do List Application
**Goal**: A full-stack web application to manage tasks (CRUD: Create, Read, Update, Delete).
**Tech Stack**: **PERN**
*   **P**ostgreSQL: The Relational Database.
*   **E**xpress.js: The Backend Web Framework.
*   **R**eact.js: The Frontend Library.
*   **N**ode.js: The Runtime Environment for the backend.

---

## 2. Frontend Architecture (React)

### Why React?
*   **Component-Based**: We break the UI into small, reusable pieces (e.g., `Card`, `Button`, `TaskDashboard`).
*   **Virtual DOM**: React updates only the parts of the page that change, making it very fast compared to reloading the whole page.
*   **Ecosystem**: Huge library support (used `shadcn/ui` here).

### Why Tailwind CSS?
*   **Utility-First**: Instead of writing separate `.css` files (e.g., `.my-button { color: red }`), we write classes directly in HTML (`className="text-red-500"`).
*   **Speed**: It makes styling incredibly fast and consistent.
*   **Responsiveness**: Easy to make mobile-friendly (e.g., `md:flex-row`).

### 📂 Frontend File Walkthrough

#### 1. `src/main.tsx` (Entry Point)
*   **What it does**: This is the "booting" file. It finds the HTML element with `id="root"` and injects our entire React app into it.
*   **Key Code**: `ReactDOM.createRoot(...).render(<App />)`

#### 2. `src/App.tsx` (Root Component)
*   **What it does**: The main container. In our case, it simply renders the `TaskDashboard` component. It keeps the structure clean.

#### 3. `src/api/client.ts` (The Bridge)
*   **What it does**: Contains all the functions to talk to the Backend.
*   **Methods**:
    *   `getTasks()`: Fetches data.
    *   `createTask()`: Sends new data.
    *   `updateTask()`: Modifies data.
    *   `deleteTask()`: Removes data.
*   **Technology**: Uses the native **Fetch API**. We use `await fetch(...)` to make asynchronous network requests.

#### 4. `src/components/TaskDashboard.tsx` (The Brain)
*   **What it does**: The main UI logic live here.
*   **Key Hooks Used**:
    *   `useState`: To store data in memory (e.g., the list of `tasks`, the `newTaskTitle` input). When "state" changes, React automatically updates the screen.
    *   `useEffect`: Runs code *after* the component loads. We use it to call `fetchTasks()` immediately when you open the page.

---

## 3. Backend Architecture (Node/Express)

### Why Node.js & Express?
*   **JavaScript Everywhere**: You use the same language (JS/TS) for both frontend and backend.
*   **Express**: A minimal framework that makes handling HTTP requests (GET, POST) very easy.
*   **Event-Driven**: Node is good at handling many requests at once without freezing.

### 📂 Backend File Walkthrough

#### 1. `src/server.ts` (The Starter)
*   **What it does**: Starts the literal server program.
*   **Key Code**: `app.listen(PORT, ...)` - It waits for requests on port 5000.

#### 2. `src/app.ts` (The Configuration)
*   **What it does**: Sets up the rules for the application.
*   **CORS (Cross-Origin Resource Sharing)**: We manually configured headers (`Access-Control-Allow-Origin`) to allow your Frontend (running on port 5173) to talk to your Backend (port 5000). Browsers block this by default for security.
*   **Middleware**: `app.use(express.json())` allows the backend to understand JSON data sent from the frontend.

#### 3. `src/db.ts` (The Database Connection)
*   **What it does**: Connects Node.js to PostgreSQL using the `pg` library.
*   **Pool**: We use a `Pool` of connections. This is efficient because opening a new connection for every single user request is slow. A pool keeps a few open and ready to use.

#### 4. `src/routes/taskRoutes.ts` (The Logic)
*   **What it does**: Defines the "endpoints" (URLs) the frontend can visit.
*   **SQL Injection Protection**: We use **Parameterized Queries** (e.g., `VALUES ($1, $2)`).
    *   *Why?* If we just pasted the user's text into the SQL string, a hacker could type text that deletes your database. Using `$1` tells Postgres "treat this strictly as text, not code".

---

## 4. Potential Viva Questions & Answers

**Q: What is a REST API?**
**A:** Representational State Transfer. It's a standard way for frontends and backends to talk. We use standard HTTP methods:
*   **GET**: Get data (Read).
*   **POST**: Submit new data (Create).
*   **PUT**: Update existing data (Update).
*   **DELETE**: Remove data (Delete).

**Q: Why didn't you use an ORM like Prisma?**
**A:** I wanted to demonstrate a strong understanding of fundamental SQL and database interactions. ORMs can sometimes hide what's happening under the hood. Using raw SQL with `pg` is fast, transparent, and great for learning.

**Q: How does the "Dark Mode" work?**
**A:** It's handled by Tailwind CSS. We defined colors in variables (CSS Variables) in `index.css`. When we change the colors for the `.dark` class or `:root`, Tailwind automatically applies these colors to elements using utility classes like `bg-background` or `text-foreground`.

**Q: What is `async/await`?**
**A:** It's modern JavaScript syntax for handling long-running tasks (like fetching data from a database). `await` pauses the code execution on that line until the task is finished, without blocking the whole server. It makes code look synchronous and readable.

**Q: Explain the flow when I click "Add Task".**
**A:**
1.  **Frontend**: User clicks button -> `handleCreate` function runs.
2.  **Network**: Browser sends a `POST` request to `http://localhost:5000/api/tasks` with the JSON data.
3.  **Backend**: Express receives request -> `taskRoutes` processes it.
4.  **Database**: The route runs an `INSERT` SQL query via `pool.query`.
5.  **Response**: Database confirms save -> Backend sends back the new task object (HTTP 201).
6.  **Update**: Frontend receives response -> Refreshes the list to show the new task.

**Q: Where is the database hosted?**
**A:** It is a PostgreSQL database hosted on **NeonDB** (a cloud provider), connected via the connection string in the `.env` file.

---

## 5. Directory Structure Summary

```
Project/
├── backend/
│   ├── src/
│   │   ├── app.ts          (Config & Rules)
│   │   ├── db.ts           (Database Connection)
│   │   ├── server.ts       (Start Script)
│   │   └── routes/         (API/SQL Logic)
│   └── package.json        (Dependencies: express, pg, etc.)
│
├── frontend/
│   ├── src/
│   │   ├── api/            (Fetch Functions)
│   │   ├── components/     (UI: TaskDashboard, Card, etc.)
│   │   ├── App.tsx         (Root Component)
│   │   └── index.css       (Tailwind & Theme Colors)
│   └── package.json        (Dependencies: React, Vite, Tailwind)
```
