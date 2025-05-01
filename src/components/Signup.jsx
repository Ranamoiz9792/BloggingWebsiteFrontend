// src/components/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import baseUrl from '../config/baseUrl'; 

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      signupSchema.parse(formData); // Validate
      setErrors({});

      await axios.post(`${baseUrl}/auth/register`, formData);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      if (err.errors) {
        const newErrors = {};
        err.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        alert('Registration failed');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>

        <input
          name="username"
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-1 border rounded"
          onChange={handleChange}
        />
        {errors.username && <p className="text-red-500 text-sm mb-2">{errors.username}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-1 border rounded"
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-1 border rounded"
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

        <button className="w-full bg-green-500 text-white p-2 rounded mt-2">Signup</button>

        <p className="text-sm mt-2">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
