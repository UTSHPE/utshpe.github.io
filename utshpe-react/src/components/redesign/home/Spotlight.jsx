import { bluebonnets, html } from "../../../lib/design";
import { spotlightMonth, spotlights } from "../../../data/spotlights";
import SpotCard from "../SpotCard";

const FLOWERS = '<svg width="56" height="80" viewBox="0 0 56 80">' + bluebonnets([[18, 26, 8], [38, 40, 6]]) + "</svg>";

/* the four "of the month" postcards, from data/spotlights.js */
export function SpotGrid({ id }) {
  return (
    <div className="fgrid" id={id} data-r style={id === "spots" ? { marginTop: 44 } : undefined}>
      {spotlights.map((s, i) => <SpotCard key={s.title} label={s.title} i={i} name={s.name} major={s.major} year={s.year} src={s.image} focus={s.focus} />)}
    </div>
  );
}

export default function Spotlight() {
  return (
    <section className="sec alt" id="spotlight" style={{ position: "relative" }}>
      <div className="center" data-r>
        <div className="eyebrow" id="spm">{spotlightMonth}</div>
        <div className="h2" style={{ marginTop: 6 }}>Spotlight of the Month</div>
        <p className="sub">Recognizing the people who make the UT SHPE familia what it is.</p>
      </div>
      <SpotGrid id="spots" />
      <div className="dec" aria-hidden="true" style={{ position: "absolute", pointerEvents: "none", right: 20, bottom: 4 }} dangerouslySetInnerHTML={html(FLOWERS)} />
    </section>
  );
}
