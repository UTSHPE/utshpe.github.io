import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close the menu when the user presses Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Prevent the mobile menu from remaining open if the window
  // is resized back to desktop size.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 850) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="nav">

      {/* =========================================
          LOGO
          ========================================= */}

      <Link
        className="brand"
        to="/"
        onClick={closeMenu}
      >
        <img
          src="/assets/images/navbar_logo.png"
          alt="UT SHPE"
        />
      </Link>


      {/* =========================================
          MOBILE MENU BUTTON
          ========================================= */}

      <button
        className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-controls="site-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        type="button"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>


      {/* =========================================
          NAVIGATION
          ========================================= */}

      <nav
        className={`menu ${menuOpen ? "menu-open" : ""}`}
        id="site-menu"
        role="navigation"
      >

        <Link
          to="/about"
          className="nav-link"
          onClick={closeMenu}
        >
          About Us
        </Link>

        <Link
          to="/leadership"
          className="nav-link"
          onClick={closeMenu}
        >
          Leadership
        </Link>

        <Link
          to="/sponsorship"
          className="nav-link"
          onClick={closeMenu}
        >
          Sponsorship
        </Link>

        <Link
          to="/shpetinas"
          className="nav-link shpetinas"
          onClick={closeMenu}
        >
          SHPEtinas
        </Link>

        <Link
          to="/membership"
          className="nav-link"
          onClick={closeMenu}
        >
          Membership
        </Link>

        {/** 
        <Link
          to="/resources"
          className="nav-link"
          onClick={closeMenu}
        >
          Resources
        </Link>*/}

      </nav>

    </header>
  );
}

export default Navbar;