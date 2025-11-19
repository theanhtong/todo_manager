import { useState } from "react";
import { Plus } from "lucide-react";
import TodoCard from "./TodoCard";
import { useTodos } from "../../contexts/TodoContext";

export default function TodoForm() {
  const {
    todos,
    toggleTodo,
    deleteTodo,
    isOpenUpdateModal,
    setIsOpenUpdateModal,
    setEditingTodoId,
  } = useTodos();

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    todoId: null,
  });

  const priorityLevel = { low: 1, medium: 2, high: 3 };

  const sortByPriority = (todos) =>
    [...todos].sort((a, b) => priorityLevel[b.priority] - priorityLevel[a.priority]);

  const handleRightClick = (e, todoId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, todoId });
  };

  const handleClickOutside = () => {
    if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
  };

  const getColumnClass = (len) => {
    if (len === 1) return "columns-1";
    if (len === 2) return "columns-2";
    return "columns-3";
  };

  return (
    <div className="w-full flex justify-center items-center" onClick={handleClickOutside}>
      {todos.length > 0 ? (
        <div className={`${getColumnClass(todos.length)} gap-2`}>
          {sortByPriority(todos).map((todo, idx) => (
            <div key={idx} onContextMenu={(e) => handleRightClick(e, todo.id)}>
              <TodoCard todo={todo} onToggle={() => toggleTodo(todo.id)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-7xl flex flex-col justify-center items-center gap-3 text-center rounded-sm py-8 border-2 border-dashed border-[#778873]">
          <h1 className="text-3xl font-bold text-[#778873]">No Todo Yet</h1>
          <span className="flex items-center gap-3 text-gray-600 text-sm italic">
            Tap
            <span className="w-9 h-9 flex justify-center items-center bg-[#a1bc98] rounded-full shadow-sm transition duration-300 hover:bg-[#8daa85]">
              <Plus className="w-4 h-4 text-white" />
            </span>
            to add your next task.
          </span>
        </div>
      )}

      {contextMenu.visible && (
        <div
          className="absolute w-48 bg-white/50 border border-[#778873] rounded-md shadow-lg z-50 overflow-hidden"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div
            onClick={() => {
              toggleTodo(contextMenu.todoId);
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="px-4 py-2 text-sm hover:bg-[#a1bc98] cursor-pointer transition-colors duration-150"
          >
            Toggle
          </div>

          <div
            onClick={() => {
              deleteTodo(contextMenu.todoId);
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="px-4 py-2 text-sm hover:bg-[#a1bc98] cursor-pointer transition-colors duration-150"
          >
            Delete
          </div>

          <div
            onClick={() => {
              setEditingTodoId(contextMenu.todoId);
              setIsOpenUpdateModal(!isOpenUpdateModal);
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="px-4 py-2 text-sm hover:bg-[#a1bc98] cursor-pointer transition-colors duration-150"
          >
            Edit
          </div>

          <div
            onClick={() => setContextMenu({ ...contextMenu, visible: false })}
            className="px-4 py-2 text-sm hover:bg-[#a1bc98] cursor-pointer transition-colors duration-150"
          >
            Close
          </div>
        </div>
      )}
    </div>
  );
}
