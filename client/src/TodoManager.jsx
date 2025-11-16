import Header from "./layouts/Header";
import TodoForm from "./components/Todo/TodoForm";
export default function TodoManager() {
  const theme = {
    ivory: "#f1f3e0",
    sage: "#d2dcb6",
    mint: "#a1bc98",
    moss: "#778873",
  };
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="max-w-screen min-h-screen bg-[#f1f3e0]"
    >
      <Header></Header>
      <TodoForm></TodoForm>
    </div>
  );
}
