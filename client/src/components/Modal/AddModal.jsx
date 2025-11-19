import { Plus, Flag, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTodos } from "../../contexts/TodoContext";

export default function AddModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [subtodos, setSubtodos] = useState([]);
  const container = useRef(null);
  const [priority, setPriority] = useState("low");
  const [isClosing, setIsClosing] = useState(false);

  const { createTodo } = useTodos();

  useEffect(() => {
    if (container.current) container.current.scrollTop = container.current.scrollHeight;
  }, [subtodos]);

  const priorityTheme = { low: "text-green-500", medium: "text-yellow-500", high: "text-red-500" };

  const handleAddSubtodo = () => {
    if (subtodos.length === 0 || subtodos[subtodos.length - 1].text.trim() !== "") {
      setError("");
      setSubtodos((prev) => [...prev, { id: Date.now(), text: "", completed: false }]);
    } else setError("Please enter the subtodo above first");
  };

  const handleRemoveSubtodo = (id) => setSubtodos((prev) => prev.filter((s) => s.id !== id));
  const handleChangeSubtodo = (id, text) =>
    setSubtodos((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));

  const handlePriority = () => {
    if (priority === "low") setPriority("medium");
    else if (priority === "medium") setPriority("high");
    else setPriority("low");
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 100);
  };

  const handleAddTodo = () => {
    if (!title.trim()) return;
    if (!description.trim()) setDescription("No description");
    const confirmedSubtodos = subtodos.filter((s) => s.text.trim());
    createTodo(title, description, priority, confirmedSubtodos);
    handleClose();
  };

  return (
    <div
      className={`w-[500px] flex flex-col gap-2 p-4 border border-[#778873] rounded-sm shadow-lg
        ${isClosing ? "animate-slide-up" : "animate-slide-down"}`}
    >
      <div className="flex flex-col justify-center items-center border-2 border-dashed border-[#d2dcb6] rounded-sm gap-2 p-4">
        <h3 className="text-xl font-bold text-[#778873]">Create a new todo</h3>
        <p className="text-sm text-gray-500 italic">"Stay organized, achieve more every day!"</p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the title"
          className="w-full px-2 py-2 border border-gray-400 text-sm rounded-sm focus:ring-1 focus:ring-[#a1bc98] outline-none"
        />
        <button
          onClick={handlePriority}
          className="w-[150px] flex justify-center items-center gap-2 px-2 py-0.5 rounded-sm border border-gray-400"
        >
          <Flag className={`w-4 h-4 ${priorityTheme[priority]}`} />
          <span className={`text-sm ${priorityTheme[priority]}`}>{priority}</span>
        </button>
      </div>
      <textarea
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter the description"
        className="px-2 py-2 border border-gray-400 text-sm rounded-sm focus:ring-1 focus:ring-[#a1bc98] outline-none resize-none"
      />
      <div className="flex flex-col justify-center items-center gap-2 p-2">
        <div ref={container} className="w-full max-h-[100px] flex flex-col gap-2 overflow-y-auto">
          {subtodos.map((subtodo) => (
            <div
              key={subtodo.id}
              className={`relative flex flex-col gap-2 p-0.5 border rounded-sm ${
                error ? "border-red-500" : "border-gray-400"
              }`}
            >
              <input
                type="text"
                value={subtodo.text}
                onChange={(e) => handleChangeSubtodo(subtodo.id, e.target.value)}
                placeholder="Enter the subtodo"
                className="w-full px-2 py-1 text-sm rounded-sm focus:ring-0 outline-none"
              />
              <button
                onClick={() => handleRemoveSubtodo(subtodo.id)}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {error && <p className="text-sm text-red-500 font-semibold px-2">{error}</p>}
        </div>
        <button
          onClick={handleAddSubtodo}
          className="w-full px-2 py-1 flex justify-center items-center rounded-sm shadow-lg bg-[#a1bc98]"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="flex flex-row gap-2">
        <button
          onClick={handleClose}
          className="w-full px-2 py-1 rounded-sm shadow-lg bg-[#d2dcb6]"
        >
          Cancel
        </button>
        <button
          onClick={handleAddTodo}
          className="w-full px-2 py-1 rounded-sm shadow-lg bg-[#d2dcb6]"
        >
          Do It.
        </button>
      </div>
    </div>
  );
}
