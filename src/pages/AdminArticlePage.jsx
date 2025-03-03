import React from 'react';
import Navbar from '../components/Navbar';
import AdminArticleEditor from '../components/AdminArticleEditor';
import { motion } from 'framer-motion';
import '../styles/adminpage.css';

function AdminArticlePage() {
  return (
    <motion.div 
      className="admin-article-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <div className="container">
        <h1>Admin Article Editor</h1>
        <AdminArticleEditor />
      </div>
    </motion.div>
  );
}

export default AdminArticlePage;
