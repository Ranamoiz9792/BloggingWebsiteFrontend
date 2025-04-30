import React from 'react';
import DisplayAllBlogs from './components/DisplayAllBlogs';  // Import the DisplayAllBlogs component
import CreateBlog from './components/CreateBlog';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-10">
      
      {/* Header */}
    

      {/* Main content */}
      <div className="w-full max-w-4xl p-6 mt-20">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Welcome to Our Blog</h1>

        {/* Display All Blogs */}
        <div className="w-full max-w-4xl p-6 mt-20"><DisplayAllBlogs /> </div>
        
      </div>
    </div>
  );
};

export default App;
