
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Blogs from './components/Blogs';
import BlogDetails from './components/BlogDetails';
function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/blogs"
          element={isAuthenticated ? <Blogs /> : <Navigate to="/login" />}
        />
        // In your router configuration
        <Route path="/blogs/details/:id" element={<BlogDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
