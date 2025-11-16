import { createContext, useState, useContext, useEffect } from "react";

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const API_URL = "http://127.0.0.1:5000";

  const [todos, setTodos] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch todos");
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((err) => console.error(err));
  }, []);

  const createTodo = async (title, description, priority, subtodos) => {
    try {
      const res = await fetch(`${API_URL}/todos/create_todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, subtodos }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create todo");

      const newTodo = {
        id: data.todo_id,
        title,
        description,
        priority,
        completed: false,
        subtodos: subtodos.map((sub, index) => ({
          id: data.subtodo_ids[index],
          text: sub.text,
          completed: false,
        })),
      };
      setTodos((prev) => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (todo_id) => {
    try {
      const res = await fetch(`${API_URL}/todos/${todo_id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle subtodo");
      setTodos((prev) => prev.filter((t) => t.id !== todo_id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTodo = async (todo_id) => {
    try {
      const res = await fetch(`${API_URL}/todos/${todo_id}`, { method: "PUT" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle todo");

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todo_id
            ? {
                ...todo,
                completed: data.completed,
                subtodos: todo.subtodos.map((s) => ({ ...s, completed: data.completed })),
              }
            : todo
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubtodo = async (todo_id, subtodo_id) => {
    try {
      const res = await fetch(`${API_URL}/todos/${todo_id}/subtodos/${subtodo_id}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle subtodo");

      setTodos((prev) =>
        prev.map((todo) => {
          if (todo.id === todo_id) {
            const updatedSubtodos = todo.subtodos.map((sub) =>
              sub.id === subtodo_id ? { ...sub, completed: data.completed } : sub
            );
            return {
              ...todo,
              subtodos: updatedSubtodos,
              completed: updatedSubtodos.every((s) => s.completed),
            };
          }
          return todo;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id, title, description, priority, subtodos) => {
    try {
      const res = await fetch(`${API_URL}/todos/edit_todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, description, priority, subtodos }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update todo");

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, title, description, priority, subtodos } : todo
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);

  const value = {
    todos,
    setTodos,
    toggleTodo,
    toggleSubtodo,
    createTodo,
    deleteTodo,
    updateTodo,
    isOpenUpdateModal,
    setIsOpenUpdateModal,
    editingTodoId,
    setEditingTodoId,
  };
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  return useContext(TodoContext);
}
