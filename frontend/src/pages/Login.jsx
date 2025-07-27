import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components/ErrorModal";
import bg from "../assets/bg.jpg"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      let customErrorMessage = handleFirebaseError(err.code);
      setError(customErrorMessage); // Set error message
      setShowModal(true); // Show the modal on error
    }
  };

  const handleFirebaseError = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No user found with this email. Please sign up.";
      case "auth/invalid-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/invalid-credential":
        return "Invalid Credentials"
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      default:
        return errorCode;
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <div className="mt-2">
              <a href="/forgotpassword" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <a href="/signup" className="text-sm text-blue-500 hover:underline">
            Sign Up
          </a>
        </div>
      </div>

      {/* Show the error modal if there is an error */}
      {showModal && <ErrorModal message={error} onClose={closeModal} />}
    </div>
  );
}
