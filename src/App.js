// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Blog from './components/Home';
import BlogDetail from './components/blogdetail';
import Create from './components/admin/ajouter';
import Admin from './components/admin/Homeadmin';
import Modifie from './components/admin/modifier';
import BlogDetail1 from './components/admin/blogdetail';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/blog1/:id" element={<BlogDetail1 />} />
        <Route path="/adminhome" element={<Admin />}/>
        <Route path="/adminmodif/:id" element={<Modifie />} />
        <Route path="/adminadd" element={<Create />}/>
      </Routes>
    </Router>
  );
}

export default App;