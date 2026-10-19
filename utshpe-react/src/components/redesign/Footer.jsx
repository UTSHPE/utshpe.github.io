import { brand, html, ico } from "../../lib/design";
import { FLICKR_URL, LEADERBOARD_URL } from "../../lib/constants";

const SOCIAL = [
  ["instagram", "Instagram", "https://www.instagram.com/utshpe/"],
  ["linkedin", "LinkedIn", "https://www.linkedin.com/company/utshpe"],
  ["tiktok", "TikTok", "https://www.tiktok.com/@utshpe"],
  ["facebook", "Facebook", "https://www.facebook.com/shpeut/"],
  ["x", "X / Twitter", "https://twitter.com/utshpe"],
  ["github", "GitHub", "https://github.com/UTSHPE"],
];

/* The design's footer markup, verbatim; every link is external, so it is plain HTML. */
const FOOTER = '<div class="air"></div><div class="fi"><div class="fg"><div><div class="wish">Wish you were here.</div><p>Find your familia. Build your future.</p><div class="fem"><a href="mailto:utshpe@gmail.com">' + ico.mail + 'utshpe@gmail.com</a><a href="mailto:shpe.ut.president@gmail.com">' + ico.mail + "shpe.ut.president@gmail.com</a></div></div>" +
  '<div><h4>On the web</h4><ul><li><a href="' + LEADERBOARD_URL + '" target="_blank" rel="noopener">' + ico.trophy + 'Leaderboard &amp; check-in</a></li><li><a href="' + FLICKR_URL + '" target="_blank" rel="noopener">' + ico.cam + "Photos on Flickr</a></li></ul></div>" +
  '<div><h4>Follow us</h4><div class="fsoc">' + SOCIAL.map((s) => '<a href="' + s[2] + '" target="_blank" rel="noopener" aria-label="' + s[1] + '" title="' + s[1] + '">' + brand[s[0]] + "</a>").join("") + '</div><a class="ftree" href="https://linktr.ee/UTSHPE" target="_blank" rel="noopener">' + brand.linktree + "Find more at our Linktree</a></div></div>" +
  '<div class="fb">© ' + new Date().getFullYear() + " UT SHPE</div></div>";

export default function Footer() {
  return <footer className="foot" id="foot" dangerouslySetInnerHTML={html(FOOTER)} />;
}
