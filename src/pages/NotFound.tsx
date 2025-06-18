import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 text-text">
      <div className="bg-white rounded-lg p-10">
        <h1 className="text-6xl font-extrabold text-brand mb-4">404</h1>
        <p className="text-xl text-muted mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-secondary hover:bg-yellow-400 cursor-pointer text-text font-bold px-6 py-3 rounded-lg transition duration-150"
          >
            Return Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-danger hover:bg-red-600 cursor-pointer text-white font-bold px-6 py-3 rounded-lg transition duration-150"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
