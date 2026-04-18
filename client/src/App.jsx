import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DeckLibrary from "./components/DeckLibrary";
import DeckView from "./components/DeckView";
import ManaImageManager from "./components/ManaImageManager";
import { ManaImageProvider } from "./components/ManaSymbol";

export default function App() {
  return (
    <ManaImageProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DeckLibrary />} />
            <Route path="/deck/:id" element={<DeckView />} />
            <Route path="/mana-symbols" element={<ManaImageManager />} />
          </Routes>
        </main>
      </div>
    </ManaImageProvider>
  );
}
