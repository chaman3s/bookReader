import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/Landingpage';
import ViewerPage from './components/DocumentViewer';
// import PdfViewer from './components/Test';
import Viewer from './pages/BookViewer';
// import Viewer from "./components/Temp";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/view" element={<Viewer/>} />
      </Routes>
    </Router>
  );
};

export default App;
