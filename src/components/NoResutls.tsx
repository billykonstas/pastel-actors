import React from "react";
import { motion } from "framer-motion";
import { BsCup } from "react-icons/bs";

export default function NoResults() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center z-30 relative py-12 px-6 text-center bg-wesPeach w-96 mx-auto border-2 border-wesBrown rounded-lg shadow-lg"
    >
      <motion.div
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-wesBrown mb-4"
      >
        <BsCup size={60} />
      </motion.div>
      <h3 className="text-2xl font-bold text-wesBrown">
        No actors in sight. Maybe they're having tea?
      </h3>
      <p className="text-lg mt-2 text-wesBrown/80">Try adjusting your search, dear.</p>
    </motion.div>
  );
}
