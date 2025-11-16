import { useState } from "react";

import TodoCard from "./TodoCard";
import { useTodos } from "../../contexts/TodoContext";
import UpdateModal from "../../components/Modal/UpdateModal";

export default function TodoForm() {
  const {
    todos,
    toggleTodo,
    deleteTodo,
    isOpenUpdateModal,
    setIsOpenUpdateModal,
    setEditingTodoId,
  } = useTodos();

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, todoId: null });

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

  return (
    <div className="w-full flex justify-center items-center" onClick={handleClickOutside}>
      <div className="column-1 md:columns-2 lg:columns-3 gap-2">
        {sortByPriority(todos).map((todo, idx) => (
          <div key={idx} onContextMenu={(e) => handleRightClick(e, todo.id)}>
            <TodoCard todo={todo} onToggle={() => toggleTodo(todo.id)} />
          </div>
        ))}
      </div>

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
