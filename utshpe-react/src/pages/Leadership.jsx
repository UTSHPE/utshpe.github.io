import useBodyPage from "../hooks/useBodyPage";
import { boardOfDirectors, executiveBoard } from "../data/leadership";
import FlipCard from "../components/redesign/FlipCard";
import { photo } from "../lib/constants";

/* the design offsets each group's tone/stamp index: exec board from 0, directors from 2 */
function Cards({ people, offset }) {
  return people.map((p, i) => (
    <FlipCard key={p.name} name={p.name} role={p.role} major={p.major} i={i + offset} pron={p.pronouns} year={p.year} src={p.image} focus={p.focus} linkedin={p.linkedin} email={p.email} />
  ));
}

const TOGETHER = [
  ["#CFE6EF", "LeaderSHPE retreat", "/assets/images/Leadership/Leadershipteam.png"],
  ["#FBD3C0", "Officer social", "/assets/images/membership/membership2.jpg"],
  ["#DCEBF2", "Service day", "/assets/images/aboutus/ChapterOutreach.jpg"],
];

export default function Leadership() {
  useBodyPage("leadership");
  return (
    <>
      <header className="lh">
        <div><div className="kick">meet the crew</div><h1>Meet UT-SHPE's 2026-2027 LeaderSHPE Team!</h1></div>
        <p>These are the amazing, determined individuals who make up our leaderSHPE team! Each of them carries vital responsibilities that sustain our chapter's vision and mission, and they lead by example with perseverance, dedication, and a passion for service.</p>
      </header>

      <section className="sec" style={{ paddingTop: 44 }}>
        <div className="grp" data-r><h2>Executive Board</h2></div>
        <div className="fgrid" id="ex" data-r><Cards people={executiveBoard} offset={0} /></div>
      </section>

      <section className="sec alt">
        <div className="grp" data-r><h2>Board of Directors</h2></div>
        <div className="fgrid four" id="bd" data-r><Cards people={boardOfDirectors} offset={2} /></div>
      </section>

      <section className="sec">
        <div className="hd" data-r><div><div className="kick">in action</div><h2>The team together</h2></div></div>
        <div className="band" data-r>
          {/* the design's band tiles are bare (no camera, no caption chip); the caption sits below */}
          {TOGETHER.map(([tone, cap, src]) => (
            <div key={cap}><div className="phd" style={{ background: tone }}>{photo(src) ? <img className="pimg" src={photo(src)} alt={cap} loading="lazy" /> : null}</div><p>{cap}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}
