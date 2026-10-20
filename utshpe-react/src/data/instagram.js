/**
 * LATEST ON INSTAGRAM (Membership page): the five tiles, newest first.
 *
 * To update:
 *   1. Open each post on instagram.com and copy its link from the address bar,
 *      e.g. "https://www.instagram.com/p/ABC123xyz/".
 *   2. Optional: save the post's photo into  public/assets/images/instagram/
 *      and put its path in `image`, e.g. "/assets/images/instagram/post1.jpg".
 *      (Afterwards, `node scripts/optimize-images.mjs` makes right-sized copies.)
 *   3. `caption` is a short description for screen readers.
 *
 * A post without an image shows the placeholder tile, still linking to the post.
 * An entry without a url links to the @utshpe profile.
 */

export const instagramPosts = [
  { url: "", image: "", caption: "" },
  { url: "", image: "", caption: "" },
  { url: "", image: "", caption: "" },
  { url: "", image: "", caption: "" },
  { url: "", image: "", caption: "" },
];
