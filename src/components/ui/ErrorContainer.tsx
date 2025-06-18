import React from "react";
import aibatt1 from "../../assets/aibatt1.png";

type ErrorProps = {
  message?: string;
};
const ErrorContainer: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div className="w-full m-2 bg-red-100 rounded-lg px-10 py-5 flex flex-col items-center justify-center min-h-[500px]">
      <img src={aibatt1} className="object-contain" />
      <h1 className="text-lg text-red-900 font-bold">
        {message || "Oops! Something went wrong..."}
      </h1>
      <h1 className="text-lg text-red-900">Please try again later</h1>
    </div>
  );
};

export default ErrorContainer;
