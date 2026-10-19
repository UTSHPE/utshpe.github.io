import { BL, html, icon, LB, NV, OR, RD } from "../../../lib/design";

const ICONS = ["tower", "cactus", "guitar", "horseshoe", "star", "bat", "boot", "armadillo", "capitol"];

/* a dashed strip of Austin line icons above the calendar */
export default function Doodle() {
  return (
    <div className="doodle" aria-hidden="true">
      {ICONS.map((n, i) => <span key={n} style={{ transform: "rotate(" + ((i % 3 - 1) * 5) + "deg)" }} dangerouslySetInnerHTML={html(icon(n, [NV, OR, BL, LB, RD][i % 5], 44))} />)}
    </div>
  );
}
