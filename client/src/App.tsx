import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home'
import Author from './Author'

function App() {

  return (
    <Router>
      <div className="container mx-auto px-4 font-jost">
        <div class="navbar bg-base-300">
          <Link class="btn btn-ghost text-3xl font-medium" to="/">Citestat</Link>
        </div>
        <div> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/author" element={<Author />} />       
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App
