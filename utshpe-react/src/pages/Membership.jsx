import useBodyPage from "../hooks/useBodyPage";
import { INSTAGRAM_URL, MEMBERSHIP_FORM_URL } from "../lib/constants";
import { BL, CAM_IG, html, NV, OR, RD } from "../lib/design";
import { spotlightMonth } from "../data/spotlights";
import PhotoHero from "../components/redesign/PhotoHero";
import PhotoTile from "../components/redesign/PhotoTile";
import Sticker from "../components/redesign/Sticker";
import { SpotGrid } from "../components/redesign/home/Spotlight";

const HERO_PHOTOS = [
  "/assets/images/membership/membership4.jpg",
  "/assets/images/membership/membership2.jpg",
  "/assets/images/membership/membership1.jpg",
  "/assets/images/membership/membership3.jpg",
].map((src) => ({ src, alt: "UT SHPE members" }));
const WHY = [
  ["#74ABC2", "Sponsored General Meetings"],
  ["#F26838", "Professional development events"],
  ["#D33E26", "Mentorship & leadership opportunities", true],
  ["#1272B8", "Recruiting & company info sessions", true],
  ["#F7B79A", "Study nights, socials, and outreach"],
];
const STEPS = [
  ["#74ABC2", "Fill out the membership form", "Tell us a little about yourself.", ["heartenv", RD]],
  ["#F26838", "Pay membership dues", "Cover your dues to become a member.", ["star", OR]],
  ["#F7B79A", "Join our Slack and follow our Instagram", "Keep up with upcoming events!", ["guitar", BL]],
  ["#9CC3D5", "Get involved!", "Come to a meeting and say hi.", ["boot", NV]],
];
const IG_TONES = ["#CFE6EF", "#FBD3C0", "#DCEBF2", "#F4C5BD", "#FDE3D6"];

/* a white frog waving "hi!" in the corner of the steps section */
const N = "#0A2350";
const FROG = '<svg width="150" height="120" viewBox="0 0 150 120"><g fill="#fff" stroke="' + N + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M56 48L62 66M66 46L72 64M94 48L88 66M84 46L78 64" fill="none"/><path d="M52 62Q75 54 98 62Q104 84 92 100Q75 106 58 100Q46 84 52 62Z"/><circle cx="56" cy="38" r="12"/><circle cx="94" cy="38" r="12"/><ellipse cx="75" cy="82" rx="16" ry="8" fill="#EAF3F8"/></g><circle cx="58" cy="39" r="3" fill="' + N + '"/><circle cx="92" cy="39" r="3" fill="' + N + '"/><g transform="translate(96 4)"><rect width="46" height="26" rx="13" fill="#fff" stroke="' + N + '" stroke-width="3"/><text x="23" y="18" text-anchor="middle" font-family="Mr Dafoe,cursive" font-size="20" fill="' + RD + '">hi!</text></g></svg>';

function FormButton() {
  return <a className="btn" href={MEMBERSHIP_FORM_URL} target="_blank" rel="noopener" data-form-link>Fill out the membership form</a>;
}

export default function Membership() {
  useBodyPage("membership");
  return (
    <>
      <header className="sh">
        <div><div className="kick">hello, future member</div><h1>Become a part of the UTSHPE Familia!</h1><p className="sub">Find your familia, grow your skills, get involved, and get plugged into opportunities across UT and beyond!</p><div style={{ marginTop: 26 }}><FormButton /></div></div>
        <PhotoHero className="ph slim" photos={HERO_PHOTOS} />
      </header>
      <div className="air"></div>

      <section className="sec">
        <div className="hd" data-r><div><div className="kick">what you get</div><h2>Why join</h2></div></div>
        <div className="wj" data-r>
          <div className="get">
            {WHY.map(([c, t, light], i) => <div className="it" style={{ "--c": c }} key={t}><i style={light ? { color: "#fff" } : undefined}>{i + 1}</i>{t}</div>)}
          </div>
          <div className="stack" id="stack">
            <PhotoTile tone="#CFE6EF" label="General meeting" cls="t1" src="/assets/images/membership/membership7.jpg" />
            <PhotoTile tone="#FBD3C0" label="Socials" src="/assets/images/membership/membership6.jpg" />
            <PhotoTile tone="#DCEBF2" label="Study night" src="/assets/images/membership/membership5.jpg" />
          </div>
        </div>
      </section>

      <section className="sec alt" style={{ position: "relative" }}>
        <div className="hd" data-r><div><div className="kick">four easy steps</div><h2>How to Join UTSHPE</h2></div></div>
        <div className="steps" data-r>
          {STEPS.map(([c, h, p, [icon, color]], i) => (
            <div className="st" style={{ "--c": c }} key={h}>
              <div className="n">{i + 1}</div><h3>{h}</h3><p>{p}</p>
              <Sticker name={icon} color={color} rot={i % 2 ? -8 : 8} style={{ right: 16, top: 16 }} />
            </div>
          ))}
        </div>
        <div className="join" data-r><FormButton /></div>
        <div className="dec" aria-hidden="true" style={{ right: 56, bottom: 26 }} dangerouslySetInnerHTML={html(FROG)} />
      </section>

      <section className="sec">
        <div className="center" data-r style={{ textAlign: "center", marginBottom: 38 }}><div className="eyebrow" id="mm">{spotlightMonth}</div><div className="h2" style={{ marginTop: 6 }}>Members to know</div></div>
        <SpotGrid id="mtk" />
      </section>

      <section className="sec alt">
        <div className="hd" data-r><div><div className="kick">what's happening</div><h2>Latest on Instagram</h2></div><a className="btn" href={INSTAGRAM_URL} target="_blank" rel="noopener">Follow @utshpe</a></div>
        <div className="ig" id="ig" data-r>
          {IG_TONES.map((t, i) => <a key={i} href={INSTAGRAM_URL} target="_blank" rel="noopener" style={{ background: t }} dangerouslySetInnerHTML={html(CAM_IG + "<span>Post " + (i + 1) + "</span>")} />)}
        </div>
      </section>

      <section className="ctaband peach">
        <div className="kick">ready when you are</div><div className="h2">Join the Familia</div>
        <p>Visit us at a general meeting, meet the team, and find your place.</p>
        <FormButton />
      </section>
    </>
  );
}
