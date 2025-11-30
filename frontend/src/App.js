import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import PropertyDetail from "./pages/PropertyDetail";
import { Toaster } from "./components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
