import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { useLoader } from "../context/PageLoaderContext";
import buffPang from "../assets/infopeng.png";

const PageLoader: React.FC = () => {
  const { message } = useLoader();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  });
  return (
    <div className="fixed top-0 left-0 h-screen w-full bg-surface/80 z-100 flex items-center justify-center flex-col p-4">
      <motion.img
        src={buffPang}
        className="h-1/6"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      <div className="flex items-center gap-2 mt-4">
        <h1 className="text-xl text-brand font-semibold">{message}</h1>
        <FiLoader className="animate-spin-slow text-brand text-xl" />
      </div>
    </div>
  );
};

export default PageLoader;
