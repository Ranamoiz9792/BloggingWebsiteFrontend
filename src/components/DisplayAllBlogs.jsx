import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../config/baseUrl'; // Importing the base URL from config file

const DisplayAllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  const loadBlogs = async () => {
    try {
      const response = await axios.get(`${baseUrl}/blogs/list`);  // Use the base URL from baseUrl.js
      setBlogs(response.data);
    } catch (err) {
      setError('Failed to fetch blogs');
      console.error(err);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Blogs</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        {blogs.length > 0 ? (
          blogs.map(blog => (
            <div key={blog._id} className="p-4 border mb-4 rounded shadow">
              <h2 className="text-lg font-semibold">{blog.title}</h2>
              <p className="text-gray-700">{blog.content}</p>
              <p className="text-sm text-gray-500">By {blog.author}</p>
            </div>
          ))
        ) : (
          <p>No blogs available</p>
        )}
      </div>
    </div>
  );
};

export default DisplayAllBlogs;
