// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXPfGFDbpto48OpJ0vdwztnTF36J_js6w",
  authDomain: "automl-lite.firebaseapp.com",
  projectId: "automl-lite",
  storageBucket: "automl-lite.firebasestorage.app",
  messagingSenderId: "169029534940",
  appId: "1:169029534940:web:003abbf1f8a0b5dae56019"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };