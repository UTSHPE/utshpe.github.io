import { html, LINKEDIN_TILE, MAIL_TILE, TONES } from "../../lib/design";
import { photoCorner, useFlip } from "./flipParts";

/*
 * S.flip(n, role, major, i, pron, year): the officer postcard. Front: photo, name, role.
 * Back: major and year, LinkedIn and email.
 */
export default function FlipCard({ name, role, major, i, pron, year, src, focus, linkedin, email, tones = TONES }) {
  const [flip, onClick] = useFlip();
  const tone = tones[i % 7];
  const mail = email || name.toLowerCase().replace(/[^a-z ]/g, "").split(" ")[0] + "@utexas.edu";
  return (
    <div className={"fc" + (flip ? " flip" : "")} tabIndex={0} aria-label={name + ", " + role + ". Hover or focus to flip."} onClick={onClick}>
      <div className="flp">
        <div className="ff"><div className="pane">
          <div className="fph" style={{ background: tone }} dangerouslySetInnerHTML={html(photoCorner(src, focus))} />
          <div className="ftx"><h3>{name}</h3>{pron ? <div className="pr">{pron}</div> : null}<div className="rl">{role}</div></div>
        </div></div>
        <div className="ff fbk"><div className="pane">
          <div className="bh"><span className="mb">More about</span><em>{name.split(" ")[0]}</em></div>
          <dl><dt>Major</dt><dd>{major}</dd><dt>Year</dt><dd className={year ? undefined : "pl"}>{year || "Year"}</dd></dl>
          <div className="ic">
            <a href={linkedin || "#"} {...(linkedin ? { target: "_blank", rel: "noopener" } : { onClick: (e) => e.preventDefault() })} aria-label={"LinkedIn for " + name} dangerouslySetInnerHTML={html(LINKEDIN_TILE)} />
            <a href={"mailto:" + mail} aria-label={"Email " + name} dangerouslySetInnerHTML={html(MAIL_TILE)} />
          </div>
        </div></div>
      </div>
    </div>
  );
}
