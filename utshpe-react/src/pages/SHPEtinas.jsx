import { useState } from "react";
import useBodyPage from "../hooks/useBodyPage";
import { FLICKR_URL } from "../lib/constants";
import { PINK_TONES, shuffle } from "../lib/design";
import { shpetinasCommittee } from "../data/shpetinasCommittee";
import { spotlightMonth, spotlights } from "../data/spotlights";
import FlipCard from "../components/redesign/FlipCard";
import SpotCard from "../components/redesign/SpotCard";
import PhotoTile from "../components/redesign/PhotoTile";

const MOSAIC_TONES = ["#F8CFE0", "#FBD3C0", "#FDE3D6", "#F4C5BD", "#F9D9E6"];
const MOSAIC = [
  ["SHPEtinas social", "t1", "/assets/images/shpetinas/shpetinasmain.JPG"],
  ["Workshop", "", "/assets/images/shpetinas/shpetinaslideshow3.JPG"],
  ["Sisterhood", "", "/assets/images/shpetinas/shpetinaslideshow4.JPG"],
];
const GALLERY = [
  ["#F8CFE0", "Brunch", "w2 h2r t1", "/assets/images/shpetinas/shpetinaslideshow1.JPG"],
  ["#FBD3C0", "Workshop", "", "/assets/images/shpetinas/shpetinaslideshow2.JPG"],
  ["#F9D9E6", "Mentor match", "h2r t2", "/assets/images/shpetinas/shpetinaslideshow6.jpg"],
  ["#F4C5BD", "Social", "", "/assets/images/shpetinas/shpetinaslideshow5.jpg"],
  ["#FDE3D6", "Volunteering", "w2", "/assets/images/shpetinas/shpetinaslideshow4.JPG"],
  ["#F6C4D6", "Sisterhood night", "", "/assets/images/shpetinas/shpetinasmain.JPG"],
  // fills the slot under Mentor match
  ["#F8CFE0", "Workshop table", "", "/assets/images/shpetinas/shpetinaslideshow3.JPG"],
];
const HIGHLIGHTS = [
  ["#F4A3C4", "Mentorship Network", "Connect with mentors and peer support systems."],
  ["#F26838", "Leadership Workshops", "Grow professional and leadership skills."],
  ["#E0709C", "Recognition Program", "Celebrate achievements and academic excellence."],
  ["#F7A672", "Sisterhood", "Lasting friendships and community."],
];

export default function SHPEtinas() {
  useBodyPage("shpetinas");
  const [tones] = useState(() => shuffle(MOSAIC_TONES));
  const shpetina = spotlights[3];
  return (
    <>
      <header className="sh">
        <div><div className="kick">SHPE at UT Austin</div><h1>SHPEtinas</h1><p className="sub">Accelerating and affirming Latina representation at every level of STEM leadership.</p></div>
        <div className="mosaic" id="mosaic">
          {MOSAIC.map(([label, cls, src], i) => <PhotoTile key={label} tone={tones[i]} label={label} cls={cls} src={src} />)}
        </div>
      </header>
      <div className="air"></div>

      <section className="sec" id="crew">
        <div className="hd" data-r><div><div className="kick">meet the crew</div><h2>SHPEtinas Committee</h2></div></div>
        <div className="fgrid" id="com" data-r>
          {shpetinasCommittee.map((c, i) => <FlipCard key={c.name} name={c.name} role={c.role} major={c.major} i={i + 1} pron="" year={c.year} src={c.image} focus={c.focus} linkedin={c.linkedin} email={c.email} tones={PINK_TONES} />)}
        </div>
      </section>

      <section className="sec alt">
        <div className="about" data-r>
          <div><div className="kick">who we are</div><div className="h2">About SHPEtinas</div>
            <p>The SHPEtinas program exists to accelerate and affirm Latina representation at every level of STEM leadership by recognizing the unique perspectives of our members. As the program expands, we remain grounded in our core mission: empowering women, fostering meaningful connections, and providing unwavering support.</p></div>
          <div className="tags">
            <div className="tag" style={{ "--c": "#F4A3C4" }}><i>1</i>Fostering Connections</div>
            <div className="tag" style={{ "--c": "#F26838" }}><i>2</i>Empowering Women</div>
            <div className="tag" style={{ "--c": "#E0709C" }}><i style={{ color: "#fff" }}>3</i>Providing Support</div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="hd" data-r><div><div className="kick">what you'll find</div><h2>Program Highlights</h2></div></div>
        <div className="hlw" data-r>
          <div className="mon"><div className="eyebrow" id="mm">{spotlightMonth}</div><div className="mt">SHPEtina of the Month</div>
            <div className="fgrid" id="mon"><SpotCard label="SHPEtina of the Month" i={3} name={shpetina.name} major={shpetina.major} year={shpetina.year} src={shpetina.image} focus={shpetina.focus} tones={PINK_TONES} /></div>
          </div>
          <div className="hl">
            {HIGHLIGHTS.map(([c, h, p], i) => <div className="c" style={{ "--c": c }} key={h}><div className="no">{"0" + (i + 1)}</div><h3>{h}</h3><p>{p}</p><div className="ln"></div></div>)}
          </div>
        </div>
      </section>

      <section className="sec alt">
        <div className="hd" data-r><div><div className="kick">together</div><h2>Our Events</h2></div><a className="btn" href={FLICKR_URL} target="_blank" rel="noopener">See more photos</a></div>
        <div className="bento" id="gal" data-r>
          {/* no visible captions here; the descriptions stay as alt text */}
          {GALLERY.map(([tone, label, cls, src]) => <PhotoTile key={label} tone={tone} alt={label} cls={cls} src={src} />)}
        </div>
      </section>
    </>
  );
}
