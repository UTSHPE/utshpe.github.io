import { useEffect, useRef, useState } from "react";
import useBodyPage from "../hooks/useBodyPage";
import { flapBat, html, shuffle } from "../lib/design";
import { pillars } from "../data/pillars";
import PhotoTile from "../components/redesign/PhotoTile";

/* the polaroid fan: three of these, shuffled each visit (tones shuffle separately, as in the design) */
const FAN_TONES = ["#CFE6EF", "#FBD3C0", "#DCEBF2", "#F4C5BD", "#FDE3D6"];
const FAN_PHOTOS = [
  // GM #4, Oct 7 2026, from the UT SHPE Flickr
  { label: "General meeting", src: "/assets/images/aboutus/gm4-2026-10-07.jpg", focus: "center 55%" },
  { label: "Carne asada", src: "/assets/images/this-week/carne-asada.jpg" },
  { label: "Friendship", src: "/assets/images/Home_Page/slideshow5.jpg" },
  { label: "Volunteer day", src: "/assets/images/aboutus/ChapterOutreach.jpg" },
  { label: "Build nights", src: "/assets/images/membership/membership5.jpg" },
];
const PILLAR_TONES = ["#CFE6EF", "#FBD3C0", "#F4C5BD", "#DCEBF2", "#FDE3D6", "#CFE6EF"];

const STATS = [
  [450, "#74ABC2", "Active Members"],
  [210, "#F26838", "Average General Meeting Attendance"],
  [35, "#D33E26", "Social & Networking Events Each Year"],
  [30, "#1272B8", "Corporate Workshops and Tech Events"],
];

const DOCS = [
  ["Bylaws", "/assets/files/2025-2026 UT SHPE Bylaws.pdf"],
  ["Constitution", "/assets/files/2025-2026 UT SHPE Constitution.pdf"],
  ["Donate", "https://give.utexas.edu/?menu=OGPENCS&solicit=ESL&response=DJ0ESL=ENDS&comments=Society%20of%20Hispanic%20Professional%20Engineers%20%28SHPE%29%20Account:%2030-2116-8093"],
];

const MISSION_ART = '<svg width="170" height="64" viewBox="0 0 170 64" aria-hidden="true"><rect x="0" y="52" width="64" height="10" rx="3" fill="#D33E26"/><rect x="8" y="32" width="48" height="22" fill="#F4C5BD"/><path d="M14 32Q32-8 50 32Z" fill="#D33E26"/><rect x="29" y="2" width="5" height="10" fill="#D33E26"/><g transform="translate(86 0)"><rect x="8" y="22" width="34" height="40" fill="#FBD3C0"/><rect x="2" y="12" width="46" height="14" rx="3" fill="#FBD3C0"/><path d="M8 12L25-2L42 12Z" fill="#F26838"/><rect x="16" y="32" width="6" height="10" rx="2" fill="#16316B" opacity=".4"/><rect x="28" y="32" width="6" height="10" rx="2" fill="#16316B" opacity=".4"/></g><g fill="#16316B" opacity=".55" transform="translate(128 6)"><path d="M0 8C-4 0-12-4-20 0C-14 3-12 7-12 11C-8 8-4 9-2 13L0 10L2 13C4 9 8 8 12 11C12 7 14 3 20 0C12-4 4 0 0 8Z" transform="translate(20 6) scale(.9)"/></g></svg>' +
  '<svg width="190" height="76" viewBox="0 0 190 76" aria-hidden="true"><g fill="none" stroke="#0A2350" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"><circle cx="146" cy="38" r="32"/><circle cx="146" cy="38" r="23"/><path d="M0 22q9-7 18 0t18 0t18 0t18 0"/><path d="M0 38q9-7 18 0t18 0t18 0t18 0"/></g><text x="146" y="34" text-anchor="middle" font-family="Archivo Black,sans-serif" font-size="9" letter-spacing="1" fill="#0A2350" fill-opacity=".6">EST.</text><text x="146" y="50" text-anchor="middle" font-family="Archivo Black,sans-serif" font-size="14" fill="#D33E26">1982</text></svg>';
const VISION_ART = '<svg width="120" height="64" viewBox="0 0 120 64" aria-hidden="true"><path d="M30 6l7.4 15 16.6 2.4-12 11.7 2.8 16.5L30 43.6 15.2 51.6 18 35.1 6 23.4 22.6 21z" fill="#F26838"/><circle cx="82" cy="24" r="5" fill="#D33E26"/><circle cx="100" cy="40" r="3.5" fill="#1272B8"/></svg><svg width="190" height="76" viewBox="0 0 190 76" aria-hidden="true"><g fill="none" stroke="#0A2350" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"><path d="M0 22q9-7 18 0t18 0t18 0t18 0"/><path d="M0 38q9-7 18 0t18 0t18 0t18 0"/><path d="M0 54q9-7 18 0t18 0t18 0t18 0"/></g></svg>';

/* the design's phone CSS matches two sections by their literal style attribute, so write it as authored */
const rawStyle = (css) => (el) => { if (el) el.setAttribute("style", css); };

/* phones: the fan keeps its 620px layout and zooms down to fit (--fz) */
function useFanZoom(ref) {
  useEffect(() => {
    const fan = ref.current;
    const ff = () => {
      const p = fan.parentElement, cs = getComputedStyle(p);
      const w = p.clientWidth - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);
      fan.style.setProperty("--fz", Math.min(1, w / 620).toFixed(4));
    };
    ff(); addEventListener("resize", ff);
    return () => removeEventListener("resize", ff);
  }, [ref]);
}

/* count up from 0 when half visible (1.2s, ease-out cubic) */
function CountUp({ to }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!("IntersectionObserver" in window)) return;
    let raf = 0;
    const run = () => {
      let t0 = null; el.textContent = "0";
      const f = (t) => { if (t0 === null) t0 = t; const p = Math.min(1, (t - t0) / 1200), k = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * k); if (p < 1) raf = requestAnimationFrame(f); };
      f(performance.now());
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(); io.unobserve(e.target); } }), { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span data-to={to} ref={ref}>{to}</span>;
}

/* the history timeline's orange line grows when half visible */
function Timeline() {
  const ref = useRef(null);
  const [on, setOn] = useState(() => !("IntersectionObserver" in window));
  useEffect(() => {
    if (on) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }), { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [on]);
  return (
    <div className={"tl" + (on ? " in" : "")} id="tl" ref={ref}>
      <div><b>1982</b><span>Founded as a subcommittee of Pi Sigma Pi.</span></div>
      <div><b>Today</b><span>A 450+ member chapter serving students, industry, and Austin.</span></div>
    </div>
  );
}

function Pillars() {
  const [i, setI] = useState(0);
  const p = pillars[i];
  return (
    <div className="pil" data-r>
      <div className="pl" id="pl">
        {pillars.map((x, k) => (
          <button key={x.name} data-i={k} style={{ "--c": x.color }} className={k === i ? "on" : undefined} onClick={() => setI(k)}><i></i>{x.name}<em>{"0" + (k + 1)}</em></button>
        ))}
      </div>
      <div className="pp" id="pp" style={{ "--c": p.color }}>
        <div><div className="no">{"0" + (i + 1)}</div><h3>{p.name}</h3><p>{p.text}</p></div>
        <PhotoTile key={i} tone={PILLAR_TONES[i]} label={p.name.split(" ")[0] + " in action"} src={p.image} />
      </div>
    </div>
  );
}

export default function About() {
  useBodyPage("about");
  const fanRef = useRef(null);
  useFanZoom(fanRef);
  const [fan] = useState(() => { const t = shuffle(FAN_TONES), l = shuffle(FAN_PHOTOS); return [0, 1, 2].map((i) => ({ tone: t[i], ...l[i] })); });

  let bats = "";
  for (let i = 0; i < 6; i++) bats += flapBat(54 - i * 4, "#16316B", 0.26 + i * 0.025, "top:" + (i % 3) * 30 + "px;animation-delay:" + (1.2 + i * 0.35) + "s");

  return (
    <>
      <header className="ah">
        <div className="bf" aria-hidden="true" id="bf" dangerouslySetInnerHTML={html(bats)} />
        <div><div className="kick">a little about us</div><h1>About UT SHPE</h1><p className="sub">The Society of Hispanic Professional Engineers at UT Austin: a chapter built on community, mentorship, and opportunity.</p></div>
        <div className="fan" id="fan" ref={fanRef}>
          {fan.map((f) => <div className="pol" key={f.label}><PhotoTile tone={f.tone} src={f.src} alt={f.label} focus={f.focus} /><p>{f.label}</p></div>)}
        </div>
      </header>
      <div className="air"></div>

      <section className="sec">
        <div className="mv2">
          <div className="mv" data-r>
            <div className="mtop" dangerouslySetInnerHTML={html(MISSION_ART)} />
            <h2>Our Mission</h2><p>Our mission is to change lives by empowering the Hispanic community to reach its fullest potential and make a lasting impact on the world through STEM awareness, access, support, and development.</p>
          </div>
          <div className="mv b" data-r style={{ "--d": "100ms" }}>
            <div className="mtop" dangerouslySetInnerHTML={html(VISION_ART)} />
            <h2>Our Vision</h2><p>SHPE's vision is a world where Hispanics are highly valued and influential as the leading innovators, scientists, mathematicians, and engineers.</p>
          </div>
        </div>
      </section>

      <section className="trio-wrap" style={{ padding: "10px 0 80px" }}>
        <div className="trio" data-r id="trio">
          <PhotoTile tone="#CFE6EF" label="Meeting" src="/assets/images/membership/membership7.jpg" />
          <PhotoTile tone="#FBD3C0" label="Social" src="/assets/images/aboutus/Aboutpic1.jpg" />
          <PhotoTile tone="#DCEBF2" label="Sponsored events" src="/assets/images/this-week/company-info-session.jpg" />
        </div>
        <div className="cap2" data-r>the familia, up close</div>
      </section>

      <section className="numband">
        <div className="kick" data-r>by the numbers</div><h2 data-r>UT SHPE in Numbers</h2>
        <div className="stats" data-r>
          {STATS.map(([to, c, l]) => (
            <div className="stat" style={{ "--c": c }} key={l}><div className="n"><CountUp to={to} /><sup>+</sup></div><div className="l">{l}</div><div className="ln"></div></div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="hd" data-r><div><div className="kick">what we stand on</div><h2>The 6 Pillars</h2></div></div>
        <Pillars />
      </section>

      <section ref={rawStyle("padding:20px 0 90px")}>
        <div className="inset">
          <div className="hist" data-r>
            <div>
              <div className="yr"><small>founded in</small>1982</div>
              <div className="hph" id="hph">
                <PhotoTile tone="#CFE6EF" alt="Then" src="/assets/images/Home_Page/slideshow1.jpg" />
                <PhotoTile tone="#FBD3C0" alt="Now" src="/assets/images/aboutus/Aboutpic2.jpg" />
              </div>
            </div>
            <div><div className="kick">our history</div><div className="h2" style={{ marginBottom: 14 }}>Our History</div>
              <p>UT SHPE was founded in 1982 as a subcommittee of the organization Pi Sigma Pi. Today our 450+ member chapter is known for building a thriving Hispanic community of mathematicians, scientists, and engineers. Our chapter is known for leadership, technical development, chapter growth, academic development, professional development, and our community outreach throughout Austin. Today we continue that mission, supporting students, connecting with industry, and giving back through service.</p>
              <Timeline />
            </div>
          </div>
        </div>
      </section>

      <section className="sec" ref={rawStyle("padding-top:20px")}>
        <div className="hd" data-r style={{ justifyContent: "center", textAlign: "center" }}><div><div className="kick">the paperwork</div><h2>Chapter documents</h2></div></div>
        <div className="res" data-r>
          {DOCS.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener">{label} <span>→</span></a>)}
        </div>
      </section>
    </>
  );
}
