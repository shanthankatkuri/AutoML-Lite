import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import DatasetUpload from "../components/DatasetUpload";
import TaskSelector from "../components/TaskSelector";
import TrainModel from "../components/TrainModel";

export default function Dashboard() {
  const [filePath, setFilePath] = useState("");
  const [task, setTask] = useState("");
  const [modelFilename, setModelFilename] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/login"))
      .catch((error) => console.error("Logout failed: ", error));
  };

  const handleUploadSuccess = (file_path) => setFilePath(file_path);
  const handleModelTrained = (filename) => setModelFilename(filename);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">AutoML Lite</div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      <div className="p-6">
        <h2 className="text-3xl font-semibold mb-6">Welcome to AutoML Lite</h2>

        <DatasetUpload onUploadSuccess={handleUploadSuccess} />
        {filePath && (
          <>
            <TaskSelector setTask={setTask} />
            {task && (
              <TrainModel
                filePath={filePath}
                task={task}
                onModelTrained={handleModelTrained}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}



