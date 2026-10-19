import { Link } from "react-router-dom";
import useBodyPage from "../hooks/useBodyPage";
import { FLICKR_URL } from "../lib/constants";
import Intro from "../components/redesign/home/Intro";
import HeroPostcard from "../components/redesign/home/HeroPostcard";
import EventsRow from "../components/redesign/home/EventsRow";
import Leaderboard from "../components/redesign/home/Leaderboard";
import Spotlight from "../components/redesign/home/Spotlight";
import Bento from "../components/redesign/home/Bento";
import Doodle from "../components/redesign/home/Doodle";
import Calendar from "../components/redesign/home/Calendar";
import OfficeHours from "../components/redesign/home/OfficeHours";
import SponsorBelt from "../components/redesign/SponsorBelt";

export default function Home() {
  useBodyPage("home");
  return (
    <>
      <Intro />
      {/* the hand-drawn wobble used by the mural, its clouds and the UT Tower */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true"><defs>
        <filter id="wob" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="6" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" /></filter>
      </defs></svg>

      <HeroPostcard />
      <div className="air"></div>

      <EventsRow />
      <Leaderboard />
      <Spotlight />

      <section className="sec">
        <div className="hd" data-r><div><div className="kick">our neighbors</div><h2>Our Sponsors</h2></div><Link className="btn" to="/sponsorship">Become a Sponsor</Link></div>
        <SponsorBelt />
      </section>

      <section className="sec alt">
        <div className="hd" data-r><div><div className="kick">a look at us</div><h2>Photos from the Familia!</h2></div><a className="btn" href={FLICKR_URL} target="_blank" rel="noopener">See More of Us</a></div>
        <Bento />
      </section>

      <Doodle />
      <Calendar />
      <OfficeHours />
    </>
  );
}
