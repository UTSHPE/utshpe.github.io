import "../styles/footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">

        {/* Contact Us */}
        <div className="footer-col">
          <h4>Contact Us</h4>

          <p>
            Primary Email:{" "}
            <a href="mailto:shpe.ut.president@gmail.com">
              shpe.ut.president@gmail.com
            </a>
          </p>

          <p>
            Corporate Email:{" "}
            <a href="mailto:utshpe@gmail.com">
              utshpe@gmail.com
            </a>
          </p>
        </div>


        {/* Social Media */}
        <div className="footer-col">
          <h4>Follow us on Social Media</h4>

          <div className="socials">
            <a
              href="https://www.facebook.com/shpeut/"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-facebook-square"></i>
            </a>

            <a
              href="https://twitter.com/utshpe?lang=en"
              aria-label="Twitter / X"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>

            <a
              href="https://www.tiktok.com/@utshpe"
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-tiktok"></i>
            </a>

            <a
              href="https://www.instagram.com/utshpe/?hl=en"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>

            <a
              href="https://www.linkedin.com/company/utshpe"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>

            <a
              href="https://github.com/UTSHPE"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-github-square"></i>
            </a>
          </div>
        </div>


        {/* Linktree */}
        <div className="footer-col">
          <h4>Find more UT-SHPE resources at our</h4>

          <h4>
            <a
              className="linktree"
              href="https://linktr.ee/UTSHPE"
              target="_blank"
              rel="noopener noreferrer"
            >
              Linktree
            </a>
          </h4>
        </div>

      </div>

      <hr className="footer-rule" />
    </footer>
  );
}

export default Footer;