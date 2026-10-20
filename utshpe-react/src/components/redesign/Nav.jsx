import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CHECKIN_URL, MEMBERSHIP_FORM_URL } from "../../lib/constants";

const PAGES = [
  ["About Us", "/about"],
  ["Leadership", "/leadership"],
  ["Sponsorship", "/sponsorship"],
  ["SHPEtinas", "/shpetinas"],
  ["Membership", "/membership"],
];

export default function Nav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // close the phone menu on route change and on Escape
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(false); }
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);

  return (
    <nav className={"nav" + (open ? " open" : "")}>
      <Link className="logo" to="/" onClick={close} aria-label="SHPE, Leading Hispanics in STEM, and the University of Texas Longhorn">
        <img src="/assets/images/redesign/nav-lockup.png" alt="SHPE, Leading Hispanics in STEM, and the Texas Longhorn" />
      </Link>
      <div className="l">
        {PAGES.map(([label, to]) => (
          <Link key={to} to={to} className={pathname === to ? "on" : undefined} onClick={close}>{label}</Link>
        ))}
        <a className="btn" href={MEMBERSHIP_FORM_URL} target="_blank" rel="noopener" onClick={close}>Join</a>
      </div>
      <a className="mcheck" href={CHECKIN_URL} target="_blank" rel="noopener">Check in</a>
      <button className="mnav" type="button" aria-label="Menu" aria-expanded={open ? "true" : "false"} onClick={() => setOpen((o) => !o)}><i></i></button>
    </nav>
  );
}
