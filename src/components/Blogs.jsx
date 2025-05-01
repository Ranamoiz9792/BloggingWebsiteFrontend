import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import baseUrl from '../config/baseUrl';

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [editBlog, setEditBlog] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);

  // Load blogs
  const loadBlogs = async () => {
    try {
      setIsLoadingBlogs(true);
      const response = await axios.get(`${baseUrl}/blogs/list`);
      setBlogs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blogs');
      console.error(err);
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);

    try {
      if (editBlog) {
        // Update existing blog
        await axios.put(`${baseUrl}/blogs/update/${editBlog._id}`, 
          {
            title: formData.title,
            content: formData.content,
            author: formData.author || undefined
          }, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        toast.success('Blog updated successfully!');
      } else {
        // Create new blog
        const response = await axios.post(`${baseUrl}/blogs/create`, 
          {
            title: formData.title,
            content: formData.content,
            author: formData.author || undefined
          }, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        toast.success(`${response.data.author} added a blog successfully!`);
      }
      
      setShowModal(false);
      loadBlogs();
      setFormData({ title: '', content: '', author: '' });
      setEditBlog(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to process request';
      toast.error(errorMessage);
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle blog edit
  const handleEdit = (blog) => {
    setEditBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author
    });
    setShowModal(true);
  };

  // Handle blog deletion
  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        setIsDeleting(true);
        await axios.delete(`${baseUrl}/blogs/delete/${blogId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Blog deleted successfully');
        loadBlogs();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete blog');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Load blogs on component mount
  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'bg-white text-gray-900 shadow-lg font-medium',
          success: {
            iconTheme: { primary: '#2563eb', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Blog Platform</h1>
          <p className="text-xl text-blue-100 opacity-90">Share your thoughts and experiences</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Add New Blog
          </button>
        </div>
      </div>

      {/* Add/Edit Blog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditBlog(null);
                    setFormData({ title: '', content: '', author: '' });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg h-32"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author (optional)
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Leave empty for 'Anonymous'"
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="mt-4 text-red-600 text-sm">{submitError}</div>
                )}

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditBlog(null);
                      setFormData({ title: '', content: '', author: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading 
                      ? editBlog 
                        ? 'Updating...' 
                        : 'Submitting...' 
                      : editBlog 
                        ? 'Update Post' 
                        : 'Create Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Blog List */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {isLoadingBlogs ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 p-4 rounded-lg mb-8 flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <div className="space-y-8">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <article 
                    key={blog._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8"
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h2>
                    
                    <div className="prose max-w-none text-gray-600 mb-6">
                      {blog.content}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {blog.author || 'Anonymous'}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/blogs/details/${blog._id}`)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-20">
                  <span className="text-6xl mb-4">📝</span>
                  <h2 className="text-2xl text-gray-600">No blog posts yet</h2>
                  <p className="text-gray-500 mt-2">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blogs;