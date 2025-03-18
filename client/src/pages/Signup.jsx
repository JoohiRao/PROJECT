import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is "user"
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
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
          <h2 className="text-4xl font-bold animate-slide-in">Join TaskHive</h2>
          <p className="text-gray-400 text-center animate-slide-in">
            Create your account and start collaborating!
          </p>
        </div>

        {/* Spacer for separation */}
        <div className="w-2 bg-gray-700"></div>

        {/* Right Side: Compact Signup Form */}
        <div className="w-[55%] bg-[#181818] py-8 px-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in">
            Create an Account
          </h2>
          <p className="text-gray-400 text-center mb-6 animate-fade-in">
            Sign up to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="animate-fade-in">
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-500 bg-[#333333] text-white rounded-lg focus:ring focus:ring-blue-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Email Input */}
            <div className="animate-fade-in">
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-500 bg-[#333333] text-white rounded-lg focus:ring focus:ring-blue-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Password Input */}
            <div className="animate-fade-in">
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-500 bg-[#333333] text-white rounded-lg focus:ring focus:ring-blue-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Role Selection */}
            <div className="animate-fade-in">
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-500 bg-[#333333] text-white rounded-lg focus:ring focus:ring-blue-500 focus:outline-none transition-all duration-300"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
            >
              Signup
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-4 animate-fade-in">
            Already have an account?{" "}
            <a href="/" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
