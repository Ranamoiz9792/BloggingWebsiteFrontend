import React, { useState } from 'react';
import axios from 'axios';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Anonymous');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and Content are required');
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/create`, { title, content, author });
      setMessage('Blog created successfully!');
      setTitle('');
      setContent('');
      setAuthor('Anonymous');
      setError('');
    } catch (err) {
      setError('Failed to create blog');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl mb-4">Create a New Blog</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {message && <div className="text-green-500 mb-4">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog Title"
          className="p-2 border mb-4 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Blog Content"
          className="p-2 border mb-4 w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          className="p-2 border mb-4 w-full"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
