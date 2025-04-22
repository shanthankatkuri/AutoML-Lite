import streamlit as st
import requests
import os

BACKEND_URL = "http://localhost:5000"
UPLOADS_DIR = "uploads"
MODELS_FOLDER = "models"

st.title("AutoML Lite")

# Upload Dataset
st.header("Upload Dataset")
uploaded_file = st.file_uploader("Choose a CSV file")

if uploaded_file:
    if not os.path.exists(UPLOADS_DIR):
        os.makedirs(UPLOADS_DIR)

    file_path = os.path.join(UPLOADS_DIR, uploaded_file.name)

    with open(file_path, "wb") as f:
        f.write(uploaded_file.read())

    files = {'file': open(file_path, 'rb')}
    response = requests.post(f"{BACKEND_URL}/upload", files=files)
    files['file'].close()  # Important: Close the file before deletion

    if response.status_code == 200:
        server_file_path = response.json()['file_path']
        st.success("File uploaded successfully")

        st.header("Select Task")
        task = st.selectbox("Choose ML Task", ["classification", "regression"])

        if st.button("Run AutoML"):
            payload = {
                "file_path": server_file_path,
                "task": task
            }
            res = requests.post(f"{BACKEND_URL}/run_automl", json=payload)

            if res.status_code == 200:
                result = res.json()
                st.success(f"Best Model: {result['best_model']}")
                st.info(f"Score: {result['score']}")

                download_url = f"{BACKEND_URL}/download/{result['model_filename']}"
                st.markdown(f"[Download Model]({download_url})")

                # After everything is done — Clean up uploads folder
