import React from "react";
import { motion } from "framer-motion";

const moodThemes = {
  happy: "bg-yellow-100 text-yellow-900",
  sad: "bg-blue-100 text-blue-900",
  anxious: "bg-amber-100 text-amber-900",
  angry: "bg-red-100 text-red-900",
  calm: "bg-green-100 text-green-900",
  lonely: "bg-pink-100 text-pink-900",
  default: "bg-white text-black",
};

const transitionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

export default function AppWrapper({ mood = "default", children }) {
  const themeClass = moodThemes[mood] || moodThemes.default;

  return (
    <motion.div
      key={mood}
      className={`min-h-screen ${themeClass} transition-colors duration-500 ease-in-out flex items-center justify-center p-6`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={transitionVariants}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        {children}
      </div>
    </motion.div>
  );
}
