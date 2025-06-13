"use client";

import { todoItem } from "@/types/todoItem";
import { ChangeEvent, useRef, useState } from "react";

const Page = () => {
  // Estado para controlar a visibilidade do modal de confirmação
  const [showConfirm, setShowConfirm] = useState(false);

  // Estado para armazenar o texto digitado no input
  const [inputTask, setInputTask] = useState<string>("");

  // Lista de tarefas
  const [listTask, setListTask] = useState<todoItem[]>([]);

  // Referência ao input para focar automaticamente após adicionar
  const inputRef = useRef<HTMLInputElement>(null);

  // Atualiza o valor do input conforme o usuário digita
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputTask(event.target.value);
  };

  // Adiciona uma nova tarefa
  const addTask = () => {
    if (!inputTask.trim()) return;

    const newTask = { id: Date.now(), label: inputTask, checked: false };
    setListTask([...listTask, newTask]);
    setInputTask("");
    inputRef.current?.focus();
  };

  // Permite adicionar tarefa ao pressionar Enter
  const handleEnterTask = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") addTask();
  };

  // Remove uma tarefa da lista
  const deleteTask = (id: number) => {
    setListTask(listTask.filter(item => item.id !== id));
  };

  // Limpa todas as tarefas
  const clearAllTasks = () => {
    setListTask([]);
    setShowConfirm(false);
  };

  // Alterna o estado de "concluído" da tarefa
  const toggleChecked = (id: number) => {
    setListTask((prev) =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Contadores auxiliares para exibir mensagens dinâmicas
  const countCheckedItems = listTask.filter((item) => item.checked).length;
  const hasItemChecked = listTask.some((item) => item.checked);
  const allItemsChecked = listTask.every((item) => item.checked);

  return (
    <div className="w-screen h-screen flex items-center flex-col text-2xl">
      <h1 className="mt-8 text-4xl">Task List</h1>

      {/* Campo de entrada e botão para adicionar tarefas */}
      <div className="bg-gray-500 flex w-full max-w-lg my-3 p-4 rounded-md border-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="new task"
          className="p-3 rounded-md flex-1 border text-2xl text-black"
          value={inputTask}
          onChange={handleInputChange}
          onKeyUp={handleEnterTask}
        />
        <button onClick={addTask} className="ml-3 p-3 bg-blue-800 text-white rounded-md">
          to add
        </button>
      </div>

      {/* Exibe a quantidade de tarefas na lista */}
      {listTask.length > 0 && (
        <p className="px-2 mb-3 text-sm bg-cyan-900 rounded-md">
          {listTask.length} item{listTask.length > 1 ? "s" : ""} in the list
        </p>
      )}

      {/* Exibe quantas tarefas foram concluídas */}
      {hasItemChecked && (
        <p className="px-1 mb-3 text-sm bg-green-800 rounded-md">
          {allItemsChecked
            ? "all items checked!"
            : countCheckedItems > 1
            ? `${countCheckedItems} items checked!`
            : `${countCheckedItems} item checked!`}
        </p>
      )}

      {/* Lista de tarefas */}
      <ul className="w-full max-w-lg pl-5 list-disc">
        {listTask.map(item => (
          <li key={item.id}>
            <input
              onChange={() => toggleChecked(item.id)}
              className="mr-2"
              type="checkbox"
              checked={item.checked}
            />
            {item.label} -{" "}
            <button onClick={() => deleteTask(item.id)} className="rounded-md p-1">
              🗑
            </button>
          </li>
        ))}
      </ul>

      {/* Botão para limpar todas as tarefas */}
      {listTask.length > 0 && (
        <button
          onClick={() => setShowConfirm(true)}
          className="mt-4 p-2 bg-red-600 text-white rounded-md"
        >
          Clear all tasks
        </button>
      )}

      {/* Modal de confirmação para limpar todas as tarefas */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4 text-black">Do you really want to delete all tasks?</p>
            <div className="flex justify-around">
              <button onClick={clearAllTasks} className="bg-red-600 text-white px-4 py-2 rounded">
                Yes
              </button>
              <button onClick={() => setShowConfirm(false)} className="bg-gray-300 text-black px-4 py-2 rounded">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
