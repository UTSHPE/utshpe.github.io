import { html, TONES } from "../../lib/design";
import { photoCorner, useFlip } from "./flipParts";

/* S.spot(label, i, name, major, year): the smaller "of the month" postcard. */
export default function SpotCard({ label, i, name, major, year, src, focus, tones = TONES }) {
  const [flip, onClick] = useFlip();
  const tone = tones[i % 7], has = !!name;
  return (
    <div className={"fc sm" + (flip ? " flip" : "")} tabIndex={0} aria-label={label + (has ? ": " + name : "") + ". Hover or focus to flip."} onClick={onClick}>
      <div className="flp">
        <div className="ff"><div className="pane">
          <div className="fph" style={{ background: tone }} dangerouslySetInnerHTML={html(photoCorner(src, i, true, focus))} />
          <div className="ftx"><div className="sl2">{label}</div><h3 className={"g0" + (has ? " on" : "")}>{name || "Name"}</h3><div className="hint0"><span className="hv">Hover to learn more</span><span className="tp">Tap to learn more</span></div></div>
        </div></div>
        <div className="ff fbk"><div className="pane np">
          <div className="bh">Spotlight <em>postcard</em></div>
          <dl><dt>Name</dt><dd className={has ? undefined : "pl"}>{name || "Name"}</dd><dt>Major</dt><dd className={has ? undefined : "pl"}>{major || "Major"}</dd><dt>Year</dt><dd className={has ? undefined : "pl"}>{year || "Year"}</dd></dl>
        </div></div>
      </div>
    </div>
  );
}
