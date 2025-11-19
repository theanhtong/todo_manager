import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useTodos } from "../contexts/TodoContext";
import AddModal from "../components/Modal/AddModal";
import UpdateModal from "../components/Modal/UpdateModal";

export default function Header() {
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const { todos, isOpenUpdateModal, setIsOpenUpdateModal, editingTodoId } = useTodos();

  useEffect(() => {
    if (isOpenAddModal && isOpenUpdateModal) {
      setIsOpenUpdateModal(false);
    }
  }, [isOpenAddModal]);
  useEffect(() => {
    if (isOpenUpdateModal && isOpenAddModal) {
      setIsOpenAddModal(false);
    }
  }, [isOpenUpdateModal]);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2 p-6">
      <div className="flex flex-col items-center p-2 gap-0.5 rounded-md">
        <h3 className="text-3xl font-bold text-[#778873] tracking-wide pb-2">Todo Manager</h3>
        <p className="text-md text-center font-semibold text-[#a1bc98] italic">
          "Organize every task with clarity, and finish every goal with purpose."
        </p>
      </div>
      <button
        onClick={() => setIsOpenAddModal(!isOpenAddModal)}
        className="w-10 h-10 flex justify-center items-center transition-colors duration-300 bg-[#a1bc98] hover:bg-[#8daa85] rounded-full"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>

      {isOpenAddModal && <AddModal onClose={() => setIsOpenAddModal(false)}></AddModal>}

      {isOpenUpdateModal && editingTodoId && (
        <UpdateModal
          onClose={() => setIsOpenUpdateModal(false)}
          todo={todos.find((t) => t.id === editingTodoId)}
        />
      )}
    </div>
  );
}
