import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import Home from './pages/Home'
import Stories from './pages/Stories'
import About from './pages/About'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/:id" element={<Stories />} />
            <Route path="/stories/:id/quiz" element={<Stories />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App

