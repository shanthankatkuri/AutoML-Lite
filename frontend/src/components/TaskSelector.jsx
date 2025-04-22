import React from "react";

export default function TaskSelector({ setTask }) {
  const handleChange = (e) => {
    setTask(e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Select Task Type</h3>

      <select
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded-md w-full"
      >
        <option value="">Select Task</option>
        <option value="regression">Regression</option>
        <option value="classification">Classification</option>
      </select>
    </div>
  );
}
