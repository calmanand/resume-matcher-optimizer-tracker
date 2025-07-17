import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Bot, Cloud } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden">
      {/* LEFT SIDE - Enhanced Project Description */}
      <motion.div
  initial={{ opacity: 0, x: -80 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  className="md:w-1/2 w-full bg-white px-8 py-16 md:px-16 flex flex-col justify-center"
>
 <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-4 leading-tight">
          Optimize Resumes. <br />
          Hire Smarter.
        </h1>
  <p className="text-xl text-gray-800 mb-10 leading-relaxed">
    Optimize resumes with real-time AI scoring. Match talent to roles. Empower hiring through NLP.
  </p>

  {/* Tech Sections */}
  <div className="space-y-10">
    {/* Frontend */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex items-start gap-5"
    >
      <div className="bg-lime-100 p-4 rounded-full">
        <Cpu className="text-green-700 w-10 h-10" />
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-green-800 mb-1">Frontend</h3>
        <p className="text-base text-gray-700">
          Built with <strong>React</strong>, <strong>Zustand</strong> for global state,
          <strong> React Router</strong>, and toast notifications for feedback.
        </p>
      </div>
    </motion.div>

    {/* Backend */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true }}
      className="flex items-start gap-5"
    >
      <div className="bg-lime-100 p-4 rounded-full">
        <ShieldCheck className="text-green-700 w-10 h-10" />
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-green-800 mb-1">Backend & Auth</h3>
        <p className="text-base text-gray-700">
          Powered by <strong>FastAPI</strong>, secure <strong>JWT authentication</strong>, and <strong>MongoDB</strong> for document storage.
        </p>
      </div>
    </motion.div>

    {/* AI & NLP */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="flex items-start gap-5"
    >
      <div className="bg-lime-100 p-4 rounded-full">
        <Bot className="text-green-700 w-10 h-10" />
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-green-800 mb-1">AI & NLP Engine</h3>
        <p className="text-base text-gray-700">
          Uses <strong>spaCy</strong>, <strong>BERT</strong>, <strong>TF-IDF</strong>, and <strong>Sentence Transformers</strong> for intelligent resume matching.
        </p>
      </div>
    </motion.div>

    {/* Cloud & Extras */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}
      className="flex items-start gap-5"
    >
      <div className="bg-lime-100 p-4 rounded-full">
        <Cloud className="text-green-700 w-10 h-10" />
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-green-800 mb-1">Cloud & Features</h3>
        <p className="text-base text-gray-700">
          Resume PDF parsing, <strong>Google Drive support</strong>, <strong>Cloudinary</strong> storage, and real-time scoring visuals.
        </p>
      </div>
    </motion.div>
  </div>
</motion.div>

      {/* RIGHT SIDE - CTA */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="md:w-1/2 w-full bg-lime-100 flex items-center justify-center p-10"
      >
        <div className="w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-green-900 mb-6">Get Started</h2>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-green-800 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition-all mb-4"
          >
            Score My Resume
          </button>
          <button
            onClick={() => navigate("/hr-dashboard")}
            className="w-full bg-white text-green-800 border-2 border-green-800 py-3 rounded-xl font-semibold shadow-md hover:bg-green-50 transition-all"
          >
            I am Hiring
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
