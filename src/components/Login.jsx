// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import baseUrl from '../config/baseUrl'; 

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      loginSchema.parse(formData);
      setErrors({});

      const res = await axios.post(`${baseUrl}/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/blogs');
    } catch (err) {
      if (err.errors) {
        const newErrors = {};
        err.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        alert('Invalid credentials');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

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

        <button className="w-full bg-blue-500 text-white p-2 rounded mt-2">Login</button>

        <p className="text-sm mt-2">
          Don’t have an account? <Link to="/" className="text-blue-600">Signup</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
