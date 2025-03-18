import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.role === "admin") {
      navigate("/admindashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="flex w-full max-w-6xl shadow-lg rounded-lg overflow-hidden">
        {/* Left Side: Logo and Welcome Message */}
        <div className="w-[60%] bg-black flex flex-col items-center justify-center p-12 space-y-6">
          <img
            src="/logo.png"
            alt="TaskHive Logo"
            className="w-48 h-48 mb-6 animate-fade-in"
          />
          <h2 className="text-4xl font-bold animate-slide-in">Welcome to TaskHive</h2>
          <p className="text-gray-400 text-center animate-slide-in">
            Collaborate, prioritize, and succeed with ease!
          </p>
        </div>

        {/* Spacer for more separation */}
        <div className="w-2 bg-gray-700"></div>

        {/* Right Side: Login Form */}
        <div className="w-[55%] bg-[#181818] p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-6 animate-fade-in">Login to Your Account</h2>
          <p className="text-gray-400 text-center mb-8 animate-fade-in">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="animate-fade-in">
              <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-500 bg-[#333333] text-white rounded-lg focus:ring focus:ring-blue-500 focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="animate-fade-in">
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-500 bg-[#333333] text-white rounded-lg focus:ring focus:ring-blue-500 focus:outline-none transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6 animate-fade-in">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
