import { CheckCircle } from "lucide-react";
import { useTodos } from "../../contexts/TodoContext";
export default function TodoCard({ todo, onToggle }) {
  const { toggleSubtodo } = useTodos();
  const priorityTheme = {
    low: "border-green-500",
    medium: "border-yellow-500",
    high: "border-red-500",
  };
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="break-inside-avoid w-full max-w-[350px] flex flex-col gap-4 p-4 border-2 border-[#778873] rounded-sm mb-2"
    >
      <div className="relative flex flex-row gap-6">
        <div
          className={`absolute w-2 h-2 top-0 right-0 rounded-full border-2  ${
            priorityTheme[todo.priority]
          }`}
        ></div>
        <div onClick={onToggle} className="w-5 h-5 rounded-full shrink-0">
          {!todo.completed && (
            <button className={`w-7 h-7 rounded-full shrink-0 border-2 border-[#778873]`}></button>
          )}
          {todo.completed && (
            <CheckCircle className="w-7 h-7 text-[#778873] rounded-full shrink-0 cursor-pointer"></CheckCircle>
          )}
        </div>
        <div
          className={`w-full overflow-hidden flex flex-col gap-0.5 ${
            todo.completed ? "line-through" : ""
          }`}
        >
          <h1 className="text-md font-medium text-gray-700 wrap-break-word">{todo.title}</h1>
          <p className="text-sm font-medium text-gray-500 ml-2 italic wrap-break-word">
            {todo.description}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {todo.subtodos?.map((subtodo, idx) => (
          <div key={idx} className="flex flex-row items-center ml-10">
            <div
              onClick={() => toggleSubtodo(todo.id, subtodo.id)}
              className="w-5 h-5 flex items-center rounded-full shrink-0 cursor-pointer"
            >
              {!subtodo.completed && (
                <button
                  className={`w-5 h-5 rounded-full shrink-0 border-2 border-[#778873]`}
                ></button>
              )}
              {subtodo.completed && (
                <CheckCircle className="w-5 h-5 text-[#778873] rounded-full shrink-0"></CheckCircle>
              )}
            </div>
            <div className="flex flex-col gap-0.5 ">
              <p
                className={`text-sm font-medium text-gray-500 ml-5 italic ${
                  subtodo.completed ? "line-through" : ""
                }`}
              >
                {subtodo.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
