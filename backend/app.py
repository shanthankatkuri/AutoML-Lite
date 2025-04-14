from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask import send_from_directory
import pandas as pd
import os
import pickle
from ml_pipeline.model_selection import run_automl
import shutil


UPLOAD_FOLDER = 'uploads'
MODEL_FOLDER = 'models'
def clear_folders():
    for folder in [UPLOAD_FOLDER, MODEL_FOLDER]:
        if os.path.exists(folder):
            shutil.rmtree(folder)
        os.makedirs(folder)

clear_folders()

app = Flask(__name__)
CORS(app)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MODEL_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    return jsonify({"message": "File uploaded successfully", "file_path": file_path})

@app.route('/run_automl', methods=['POST'])
def automl():
    data = request.json
    file_path = data['file_path']
    task = data['task']

    df = pd.read_csv(file_path)
    best_model, best_score, model_name = run_automl(df, task)

    model_path = os.path.join(MODEL_FOLDER, f"{model_name}.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(best_model, f)

    return jsonify({
    "best_model": model_name,
    "score": best_score,
    "model_filename": f"{model_name}.pkl"
})



@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory('models', filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)