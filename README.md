# Simple Todo App

My first full-stack web application! Built with Flask, PostgreSQL, and React to learn how backend and frontend work together.

---

## What it does

* Add, edit, and delete todos
* Break todos into smaller subtasks
* Check off completed items
* Set priority levels (low, medium, high)
* Everything updates automatically between todos and subtasks

---

## Technologies I used

**Backend:**

* Flask (Python web framework)
* PostgreSQL (database)
* psycopg2 (connects Python with PostgreSQL)
* Flask-CORS (allows frontend to communicate with backend)

**Frontend:**

* React (JavaScript library for UI)
* Context API (manages app state)
* Fetch API (sends requests to backend)
* TailwindCSS (styling)

---

## How to run this project

### Setting up the Backend

1. **Install dependencies:**

```bash
pip install flask psycopg2 flask-cors
```

2. **Create a database config file:**

Create `config.py` in your backend folder:

```python
DB_CONFIG = {
    "host": "localhost",
    "database": "your_database_name",
    "user": "your_username",
    "password": "your_password"
}
```

3. **Set up the database tables:**

```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(10),
    completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE subtodos (
    id SERIAL PRIMARY KEY,
    todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
    text VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);
```

4. **Start the server:**

```bash
python app.py
```

Backend will run at `http://127.0.0.1:5000`

---

### Setting up the Frontend

1. **Install packages:**

```bash
npm install
npm install tailwindcss @tailwindcss/vite
npm install lucide-react
```

2. **Run the app:**

```bash
npm run dev
```

Frontend will open at `http://localhost:3000`

---

## How the API works

* `GET /todos` - Gets all todos and subtasks
* `POST /todos/create_todo` - Creates a new todo
* `PUT /todos/<todo_id>` - Marks a todo as done/undone
* `PUT /todos/<todo_id>/subtodos/<subtodo_id>` - Marks a subtask as done/undone
* `POST /todos/update_todo` - Updates todo information
* `DELETE /todos/<todo_id>` - Deletes a todo

---

## What I learned

* Connect a database to a backend server
* Create REST APIs with Flask
* Build a React frontend that communicates with the backend
* Handle state management in React
* Work with SQL databases

---

## Future improvements

* Add user authentication
* Add due dates for todos
* Filter and search functionality
* Better error handling
* Deploy it online
