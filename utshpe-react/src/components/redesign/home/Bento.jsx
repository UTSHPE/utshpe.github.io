import { NV, OR, RD } from "../../../lib/design";
import { FLICKR_URL } from "../../../lib/constants";
import thisWeek from "../../../data/thisWeek";
import PhotoTile from "../PhotoTile";
import Sticker from "../Sticker";

/* the design's seven tiles: tone and shape by position */
const SHAPE = [["#CFE6EF", "w2 h2r t1"], ["#FBD3C0", ""], ["#DCEBF2", "h2r t2"], ["#F4C5BD", ""], ["#FDE3D6", "h2r"], ["#CFE6EF", "w2"], ["#FBD3C0", "h2r t1"]];
const STICKERS = { 0: ["boot", RD, -8], 2: ["guitar", OR, 10], 4: ["horseshoe", OR, -6], 6: ["bat", NV, 8] };

export default function Bento() {
  return (
    <div className="bento" id="albums" data-r>
      {SHAPE.map(([tone, cls], i) => {
        const p = thisWeek[i] || {}, st = STICKERS[i];
        return (
          <PhotoTile key={i} tone={tone} label={p.caption} cls={cls} src={p.image} focus={p.focus}>
            {st ? <Sticker name={st[0]} color={st[1]} rot={st[2]} style={{ right: 14, top: 14, left: "auto" }} /> : null}
          </PhotoTile>
        );
      })}
      <a className="more w2" href={FLICKR_URL} target="_blank" rel="noopener">See more of us →</a>
    </div>
  );
}
