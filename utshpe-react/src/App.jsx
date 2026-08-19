import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Leadership from "./pages/Leadership";
import Sponsorship from "./pages/Sponsorship";
import SHPEtinas from "./pages/SHPEtinas";
import Membership from "./pages/Membership";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import CodingResources from "./pages/CodingResources";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/sponsorship" element={<Sponsorship />} />
          <Route path="/shpetinas" element={<SHPEtinas />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/coding-resources" element={<CodingResources />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;