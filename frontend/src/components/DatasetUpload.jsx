import React, { useState } from "react";

export default function DatasetUpload({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            setUploadStatus("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            if (response.ok) {
                setUploadStatus("Dataset uploaded successfully!");
                onUploadSuccess(data.file_path);
            } else {
                setUploadStatus(data.message || "Upload failed.");
            }
        } catch (error) {
            setUploadStatus("Upload failed.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">Upload Dataset</h3>

            <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-300 p-2 rounded-md mb-4 w-full"
            />

            <button
                onClick={handleFileUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
                Upload Dataset
            </button>

            {uploadStatus && (
                <p
                    className={`mt-4 text-center ${uploadStatus.includes("success") ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {uploadStatus}
                </p>
            )}
        </div>
    );
}
