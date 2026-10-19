import { useState } from "react";
import { Link } from "react-router-dom";
import { html, SYMBOL } from "../../../lib/design";
import { OFFICE_HOURS, OFFICER_COLORS } from "../../../data/officeHours";

const H = 72, DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/* the "OFFICE HOURS / MON TO FRI" stamp and the AUSTIN, TEXAS postmark, verbatim */
const STAMP_AND_POSTMARK = '<svg class="stamp" width="92" height="115" viewBox="0 0 120 150" aria-hidden="true"><rect width="120" height="150" fill="#EAF3F8"/><rect x="13" y="13" width="94" height="124" fill="none" stroke="#16316B" stroke-width="2.5"/><image href="' + SYMBOL + '" x="24" y="26" width="72" height="70"/><text x="60" y="117" text-anchor="middle" font-family="\'Archivo Black\',sans-serif" font-size="11" fill="#16316B">OFFICE HOURS</text><text x="60" y="130" text-anchor="middle" font-family="\'DM Sans\',sans-serif" font-weight="700" font-size="7" letter-spacing="1.6" fill="#F26838">MON TO FRI</text><rect x="4" y="4" width="112" height="142" fill="none" stroke="#fff" stroke-width="9" stroke-dasharray="0 11" stroke-linecap="round"/></svg><svg class="pm" viewBox="0 0 200 112" aria-hidden="true"><g fill="none" stroke="#0A2350" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"><circle cx="148" cy="56" r="44"/><circle cx="148" cy="56" r="31"/><path d="M0 26q10-8 20 0t20 0t20 0t20 0t20 0"/><path d="M0 44q10-8 20 0t20 0t20 0t20 0t20 0"/></g><path id="pmc2" d="M148 56m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" fill="none"/><text font-family="\'DM Sans\',sans-serif" font-weight="700" font-size="8.6" letter-spacing="1.2" fill="#0A2350" fill-opacity=".6"><textPath href="#pmc2">AUSTIN, TEXAS · OFFICE HOURS · </textPath></text><text x="148" y="60" text-anchor="middle" font-family="\'Archivo Black\',sans-serif" font-size="12" fill="#0A2350" fill-opacity=".6">UT SHPE</text></svg>';

/* an office-hours block that flips (hover, or tap) to show role, year and major */
function Block({ b }) {
  const [flip, setFlip] = useState(false);
  const c = OFFICER_COLORS[b[0]], ht = (b[6] - b[5]) * H, rs = Math.round((b[5] - 9) * 2) + 1, re = Math.round((b[6] - 9) * 2) + 1;
  return (
    <div className={"blk" + (ht < 60 ? " tiny" : "") + (flip ? " flip" : "")} tabIndex={0} style={{ gridRow: rs + "/" + re }} onClick={() => setFlip((f) => !f)}>
      <div className="flp">
        <div className="face" style={{ "--bg": c[0], "--fg": c[1] }}><b>{b[0]}</b><small>{b[1]}</small></div>
        <div className="face back" style={{ "--bg": c[2], "--fg": c[3] }}><b>{b[2]}</b><small>{b[3]}</small><small>{b[4]}</small></div>
      </div>
    </div>
  );
}

export default function OfficeHours() {
  const hours = [];
  for (let hr = 9; hr <= 18; hr++) hours.push(hr);
  return (
    <section className="sec alt" id="meet">
      <div className="center" data-r>
        <div className="kick">come say hi</div><div className="h2">Meet the Familia</div>
        <p className="sub">Visit us during office hours to connect with our leadership team, learn more about our pillars, ask questions, or find out how you can become part of the UT SHPE familia.</p>
      </div>
      <div className="ohp" data-r><div className="ohc">
        <div className="ohs" dangerouslySetInnerHTML={html(STAMP_AND_POSTMARK)} />
        <div className="ohl">
          <div className="dear">Dear member,</div>
          <h3>LeaderSHPE <em>Office Hours</em></h3>
          <p>Drop in and meet your officers, Monday through Friday.</p>
          <div className="grid" id="ohg">
            <div></div>
            {DAYS.map((d) => <div className="hh" key={d}><span className="fl">{d}</span><span className="ab">{d.slice(0, 3)}</span></div>)}
            <div className="times">
              {hours.map((hr) => <span key={hr} style={{ top: (hr - 9) * H }}>{(hr > 12 ? hr - 12 : hr) + ":00"}<small>{hr >= 12 ? "PM" : "AM"}</small></span>)}
            </div>
            {OFFICE_HOURS.map((day, i) => <div className="day" key={i}>{day.map((b, j) => <Block key={j} b={b} />)}</div>)}
          </div>
          <div style={{ textAlign: "center", paddingBottom: 6 }}><Link className="btn" to="/leadership">Meet the full leadership team</Link></div>
        </div>
      </div></div>
    </section>
  );
}
