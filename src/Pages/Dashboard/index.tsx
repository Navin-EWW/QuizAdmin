import React from "react";
import { motion } from "framer-motion";
export function Dashboard() {
  return (
    <>
      <motion.div
        className="min-h-full bg-white px-4 py-4 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8"
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.5,
          ease: [0.5, 0.5, 0.5, 0.5],
        }}
        initial={{ opacity: 0 }}
        // whileHover={{ scale: 1.2 }}
      >
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Dashboard
            </h2>
          </main>
        </div>
      </motion.div>
    </>
  );
}

