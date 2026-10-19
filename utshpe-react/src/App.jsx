import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Nav from "./components/redesign/Nav";
import Footer from "./components/redesign/Footer";
import useReveal from "./hooks/useReveal";

import Home from "./pages/Home";
import About from "./pages/About";
import Leadership from "./pages/Leadership";
import Sponsorship from "./pages/Sponsorship";
import SHPEtinas from "./pages/SHPEtinas";
import Membership from "./pages/Membership";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import CodingResources from "./pages/CodingResources";

/* New page: start at the top, unless the URL points at a section. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/* In-page links (like View Calendar) scroll smoothly to their section, as in the design. */
function useSmoothHashLinks() {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const t = document.getElementById(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

function Layout() {
  useReveal();
  useSmoothHashLinks();
  return (
    <>
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/sponsorship" element={<Sponsorship />} />
          <Route path="/shpetinas" element={<SHPEtinas />} />
          <Route path="/membership" element={<Membership />} />
          {/* not in the redesign's nav; their old content inside the new header and footer */}
          <Route path="/resources" element={<div className="stub"><Resources /></div>} />
          <Route path="/contact" element={<div className="stub"><Contact /></div>} />
          <Route path="/coding-resources" element={<div className="stub"><CodingResources /></div>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
