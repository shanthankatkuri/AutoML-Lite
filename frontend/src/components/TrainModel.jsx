import React, { useState } from "react";
import DownloadModel from "./DownloadModel";

export default function TrainModel({ filePath, task, onModelTrained }) {
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [score, setScore] = useState(null);
  const [modelFilename, setModelFilename] = useState("");

  const handleTrainModel = async () => {
    setLoading(true);

    const response = await fetch("http://localhost:5000/run_automl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_path: filePath, task }),
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      setModel(data.best_model);
      setScore(data.score);
      setModelFilename(data.model_filename);
      onModelTrained(data.model_filename);
    } else {
      alert("Model training failed.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Train Model</h3>

      <button
        onClick={handleTrainModel}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Training..." : "Train Model"}
      </button>

      {model && (
        <div className="mt-4">
          <p>Best Model: {model}</p>
          <p>Score: {score}</p>
        </div>
      )}

      {modelFilename && <DownloadModel filename={modelFilename} />}
    </div>
  );
}
