import { Plus, Flag, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTodos } from "../../contexts/TodoContext";
export default function AddModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [subtodos, setSubtodos] = useState([]);
  const handleAddSubtodo = () => {
    if (subtodos.length === 0 || subtodos[subtodos.length - 1].text.trim() !== "") {
      setError("");
      setSubtodos((prev) => [...prev, { id: Date.now(), text: "", completed: false }]);
    } else {
      setError("Please enter the subtodo above first");
    }
  };
  const handleRemoveSubtodo = (id) => {
    setSubtodos((prev) => prev.filter((subtodo) => subtodo.id !== id));
  };
  const handleChangeSubtodo = (id, text) => {
    setSubtodos((prev) =>
      prev.map((subtodo) => (subtodo.id === id ? { ...subtodo, text } : subtodo))
    );
  };
  const container = useRef(null);
  useEffect(() => {
    container.current.scrollTop = container.current.scrollHeight;
  }, [subtodos]);

  const priorityTheme = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };
  const [priority, setPriority] = useState("low");
  const handlePriotiryLevel = () => {
    if (priority === "low") setPriority("medium");
    else if (priority === "medium") setPriority("high");
    else setPriority("low");
  };

  const { createTodo } = useTodos();
  const hanleAddTodo = () => {
    if (!title.trim()) return;
    if (!description.trim()) setDescription("No description");
    const confirmSubtodos =
      subtodos.length > 0 ? subtodos.filter((subtodo) => subtodo.text.trim()) : [];
    createTodo(title, description, priority, confirmSubtodos);
    onClose();
  };

  return (
    <div className="w-[500px] flex flex-col gap-2 p-4 border border-[#778873] rounded-sm shadow-lg">
      <div className="flex flex-col justify-center items-center border-2 border-dashed border-[#d2dcb6] rounded-sm gap-2 p-4">
        <h3 className="text-xl font-bold text-[#778873]">Create a new todo</h3>
        <p className="text-sm text-gray-500 italic">"Stay organized, achieve more every day!"</p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-2 py-2 border border-gray-400 text-sm rounded-sm focus:ring-1 focus:ring-[#a1bc98] outline-none"
          placeholder="Enter the title"
        />
        <button
          onClick={() => handlePriotiryLevel()}
          className="w-[150px] flex justify-center items-center gap-2 px-2 py-0.5 rounded-sm border border-gray-400"
        >
          <Flag className={`w-4 h-4 ${priorityTheme[priority]}`}></Flag>
          <span className={`text-sm ${priorityTheme[priority]}`}>{priority}</span>
        </button>
      </div>
      <textarea
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="px-2 py-2 border border-gray-400 text-sm rounded-sm focus:ring-1 focus:ring-[#a1bc98] outline-none resize-none"
        placeholder="Enter the description"
      ></textarea>
      <div className="flex flex-col justify-center items-center gap-2 p-2">
        <div
          ref={container}
          className="w-full h-full max-h-[100px] flex flex-col gap-2 overflow-y-scroll"
        >
          {subtodos?.map((subtodo, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col gap-2 p-0.5 border rounded-sm ${
                error ? "border-red-500" : "border-gray-400"
              }`}
            >
              <input
                type="text"
                value={subtodo.text}
                onChange={(e) => handleChangeSubtodo(subtodo.id, e.target.value)}
                className={`w-full px-2 py-1 text-sm rounded-sm focus:ring-0 outline-none`}
                placeholder="Enter the subtodo"
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
          <Plus className="w-5 h-5 text-white"></Plus>
        </button>
      </div>
      <div className="flex flex-row gap-2">
        <button onClick={onClose} className="w-full px-2 py-1 rounded-sm shadow-lg bg-[#d2dcb6]">
          Cancel
        </button>
        <button
          onClick={() => hanleAddTodo()}
          className="w-full px-2 py-1 rounded-sm shadow-lg bg-[#d2dcb6]"
        >
          Do It.
        </button>
      </div>
    </div>
  );
}
