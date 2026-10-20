import useBodyPage from "../hooks/useBodyPage";
import { SPONSOR_PACKET_URL } from "../lib/constants";
import { sponsors } from "../data/sponsors";
import PhotoTile from "../components/redesign/PhotoTile";
import { SponsorLogo } from "../components/redesign/SponsorBelt";

/* stamp backgrounds and inner-border colors cycle every four sponsors */
const F = ["#EAF3F8", "#FDEEE6", "#DCEBF2", "#FBD3C0"], BC = ["#1272B8", "#E0743A", "#16316B", "#C9531F"];

export default function Sponsorship() {
  useBodyPage("sponsorship");
  return (
    <>
      <header className="sh">
        <div><div className="kick">with gratitude</div><h1>Thank You to Our Sponsors!</h1>
          <p className="sub">A special thank you to all companies who have supported us this year! Your commitment in empowering Hispanics in STEM is one-of-a-kind and will provide lots of opportunities for our members. Your support represents the hope and the desire for a better future. Our chapter and leadership team gratefully appreciate you for believing in us!</p></div>
        <div className="mosaic" id="mosaic">
          <PhotoTile tone="#CFE6EF" alt="Sponsor event" cls="t1" src="/assets/images/sponsors/Sponsorpage.jpg" />
          <PhotoTile tone="#FBD3C0" alt="Sponsor social" src="/assets/images/sponsors/Sponsorspage2.jpg" />
          <PhotoTile tone="#DCEBF2" alt="Company visit" src="/assets/images/sponsors/Sponsorspage3.jpg" />
        </div>
      </header>
      <div className="air"></div>

      <section className="sec">
        <div className="hd" data-r><div><div className="kick">our collection</div><h2>Our Sponsors</h2></div></div>
        <div className="stamps" id="stamps" data-r>
          {sponsors.map((s, i) => (
            <div className="stt" key={s.name} style={{ background: F[i % 4], "--bc": BC[i % 4] }}><SponsorLogo sponsor={s} /><b>{s.name}</b></div>
          ))}
        </div>
      </section>

      <section className="sec alt">
        <div className="hd" data-r><div><div className="kick">in the room</div><h2>Sponsor events</h2></div></div>
        <div className="evg" id="evg" data-r>
          <PhotoTile tone="#CFE6EF" alt="Sponsor event 1" cls="t1" src="/assets/images/aboutus/ProfessionalDevelopment.png" />
          <PhotoTile tone="#FBD3C0" alt="Sponsor event 2" src="/assets/images/this-week/company-info-session.jpg" />
          <PhotoTile tone="#DCEBF2" alt="Sponsor event 3" src="/assets/images/Home_Page/slideshow2.jpg" />
        </div>
      </section>

      <section className="sec">
        <div className="become" data-r>
          <div>
            <div className="kick">write to us</div><div className="h2">Become a Sponsor Today</div>
            <p>Become a sponsor by contacting our Corporate Director at utshpe@gmail.com. Your support helps UT SHPE students drive toward their goals. We're happy to answer any questions you have, including specific event donations.</p>
            <div className="acts"><a className="btn" href={SPONSOR_PACKET_URL} target="_blank" rel="noopener">View Corporate Sponsorship Packet (PDF)</a><a className="btn soft" href="mailto:utshpe@gmail.com">Email the Corporate Director</a></div>
          </div>
          <div className="card"><div className="l">To</div><div className="e">utshpe@gmail.com</div><div className="s">Corporate Director, UT SHPE</div><span className="pm">Postmarked: Austin, Texas</span></div>
        </div>
      </section>
    </>
  );
}
