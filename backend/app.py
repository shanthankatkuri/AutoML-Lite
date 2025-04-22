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

@app.route('/')
def home():
    return 'AutoML Lite backend is running!'

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
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

#---------------------------------------------------------

# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from bson.objectid import ObjectId
# from io import BytesIO
# from db import fs, files_collection
# import pandas as pd
# import pickle
# from ml_pipeline.model_selection import run_automl
# import os

# app = Flask(__name__)
# CORS(app)

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     file = request.files['file']
#     user_id = request.form.get('user_id')
#     task = request.form.get('task')
#     file_id = fs.put(file, filename=file.filename, user_id=user_id, task=task)
    
#     return jsonify({
#         "message": "File uploaded successfully",
#         "file_id": str(file_id)
#     })

# @app.route('/run_automl', methods=['POST'])
# def run_model():
#     data = request.get_json()
#     file_id = data['file_id']
#     user_id = data['user_id']
#     task = data['task']

#     grid_out = fs.get(ObjectId(file_id))
#     df = pd.read_csv(BytesIO(grid_out.read()))
    
#     best_model, best_score, model_name = run_automl(df, task)
#     model_binary = pickle.dumps(best_model)

#     model_id = fs.put(model_binary, filename=f"{model_name}.pkl", user_id=user_id, dataset_id=file_id)

#     files_collection.insert_one({
#         "user_id": user_id,
#         "dataset_id": file_id,
#         "model_id": model_id,
#         "dataset_filename": grid_out.filename,
#         "model_filename": f"{model_name}.pkl",
#         "task": task,
#         "score": best_score
#     })

#     return jsonify({
#         "message": "Model trained",
#         "model_filename": f"{model_name}.pkl",
#         "model_id": str(model_id),
#         "score": best_score
#     })

# @app.route('/download/<model_id>', methods=['GET'])
# def download_model(model_id):
#     file = fs.get(ObjectId(model_id))
#     return send_file(BytesIO(file.read()), download_name=file.filename, as_attachment=True)

# @app.route('/user/files/<user_id>', methods=['GET'])
# def get_user_files(user_id):
#     data = files_collection.find({"user_id": user_id})
#     result = [{
#         "dataset_filename": item["dataset_filename"],
#         "model_filename": item["model_filename"],
#         "score": item["score"],
#         "model_id": str(item["model_id"]),
#         "dataset_id": str(item["dataset_id"])
#     } for item in data]
#     return jsonify(result)

# @app.route('/delete/<model_id>/<dataset_id>', methods=['DELETE'])
# def delete_files(model_id, dataset_id):
#     fs.delete(ObjectId(model_id))
#     fs.delete(ObjectId(dataset_id))
#     files_collection.delete_one({
#         "model_id": ObjectId(model_id),
#         "dataset_id": ObjectId(dataset_id)
#     })
#     return jsonify({"message": "Files deleted"})

# if __name__ == '__main__':
#     port = int(os.environ.get("PORT", 5000))
#     app.run(host='0.0.0.0', port=port, debug=True)