import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen 
    bg-gradient-to-b from-black to-gray-900 text-white text-center px-6">
      {/* Animated 404 */}
      <motion.h1
        className="text-9xl font-extrabold drop-shadow-lg text-red-600"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="mt-4 text-2xl font-semibold"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Oops! Page not found
      </motion.p>

      <motion.p
        className="mt-2 text-lg text-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        The page you’re looking for doesn’t exist or has been moved.
      </motion.p>

      {/* Go Home Button */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Link
          to="/"
          className="px-6 py-3 bg-white text-indigo-600 rounded-full shadow-xl font-semibold hover:bg-gray-200 transition"
        >
          Go Back Home
        </Link>
      </motion.div>

      {/* Floating animation effect */}
      <motion.div
        className="absolute bottom-10 text-gray-300 text-sm"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        🚀 Keep exploring...
      </motion.div>
    </div>
  );
}
