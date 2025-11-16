from flask import Flask, jsonify, request
import psycopg2
from flask_cors import CORS
from config import DB_CONFIG

app = Flask(__name__)
CORS(app)

def get_connection():
    try:
        conn = psycopg2.connect(
            host=DB_CONFIG["host"],
            database=DB_CONFIG["database"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"]
        )
        return conn 
    except Exception as e:
        print("Error:", e)
        return None

@app.route("/todos", methods=["GET"])
def get_todos():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, title, description, priority, completed FROM todos")
        todos_data = cur.fetchall()
        todos = []
        for t in todos_data:
            todo_id = t[0]
            cur.execute("SELECT id, text, completed FROM subtodos WHERE todo_id=%s", (todo_id,))
            subtodos_data = cur.fetchall()
            subtodos_list = [{"id": s[0], "text": s[1], "completed": s[2]} for s in subtodos_data]
            todos.append({
                "id": todo_id,
                "title": t[1],
                "description": t[2],
                "priority": t[3],
                "completed": t[4],
                "subtodos": subtodos_list
            })
        return jsonify(todos)
    finally:
        cur.close()
        conn.close()

@app.route("/todos/<int:todo_id>", methods=["PUT"])
def toggle_todo(todo_id):
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT completed FROM todos WHERE id=%s", (todo_id,))
        row = cur.fetchone()
        if not row:
            return jsonify({"error": "Todo not found"}), 404
        new_status = not row[0]
        cur.execute("UPDATE todos SET completed=%s WHERE id=%s", (new_status, todo_id))
        cur.execute("UPDATE subtodos SET completed=%s WHERE todo_id=%s", (new_status, todo_id))
        conn.commit()
        return jsonify({"success": True, "completed": new_status})
    finally:
        cur.close()
        conn.close()

@app.route("/todos/<int:todo_id>/subtodos/<int:subtodo_id>", methods=["PUT"])
def toggle_subtodo(todo_id, subtodo_id):
    conn = get_connection() 
    try:
        cur = conn.cursor()
        cur.execute("SELECT completed FROM subtodos WHERE id=%s AND todo_id=%s", (subtodo_id, todo_id))
        row = cur.fetchone()
        if not row:
            return jsonify({"error": "Subtodo not found"}), 404
        new_status = not row[0]
        cur.execute("UPDATE subtodos SET completed=%s WHERE id=%s AND todo_id=%s", (new_status, subtodo_id, todo_id))
        conn.commit()
        cur.execute("SELECT COUNT(*) FROM subtodos WHERE todo_id=%s AND completed=FALSE", (todo_id,))
        remaining = cur.fetchone()[0]
        cur.execute("UPDATE todos SET completed=%s WHERE id=%s", (remaining == 0, todo_id))
        conn.commit()
        return jsonify({"success": True, "completed": new_status})
    finally:
        cur.close()
        conn.close()

@app.route("/todos/create_todo", methods=["POST"])
def create_todo():
    data = request.json
    title = data.get("title")
    description = data.get("description", "")
    priority = data.get("priority")
    subtodos = data.get("subtodos")
    if not title:
        return jsonify({"error": "Title is required"}), 400
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO todos (title, description, priority, completed) VALUES (%s, %s, %s, FALSE) RETURNING id",
            (title, description, priority)
        )
        todo_id = cur.fetchone()[0]

        subtodo_ids = []
        for sub in subtodos:
            text = sub.get("text")
            if text:
                cur.execute(
                    "INSERT INTO subtodos (todo_id, text, completed) VALUES (%s, %s, FALSE) RETURNING id",
                    (todo_id, text)
                )
                subtodo_ids.append(cur.fetchone()[0])
        conn.commit()
        return jsonify({
            "success": True,
            "todo_id": todo_id,
            "subtodo_ids": subtodo_ids
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM todos WHERE id = %s", (todo_id,))
        conn.commit()
        return {"message": "Deleted"}, 200
    finally:
        cur.close()
        conn.close()

@app.route("/todos/update_todo", methods=["POST"])
def update_todo():
    data = request.json
    todo_id = data.get("id")
    title = data.get("title")
    description = data.get("description")
    priority = data.get("priority")
    subtodos = data.get("subtodos")

    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            "UPDATE todos SET title=%s, description=%s, priority=%s WHERE id=%s",
            (title, description, priority, todo_id)
        )
        cur.execute("DELETE FROM subtodos WHERE todo_id=%s", (todo_id,))
        subtodo_ids = []
        for sub in subtodos:
            text = sub.get("text")
            if text:
                cur.execute(
                    "INSERT INTO subtodos (todo_id, text, completed) VALUES (%s, %s, FALSE) RETURNING id",
                    (todo_id, text)
                )
                subtodo_ids.append(cur.fetchone()[0])
        conn.commit()
        return {"message": "Todo updated successfully"}, 200
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    app.run(debug=True)
