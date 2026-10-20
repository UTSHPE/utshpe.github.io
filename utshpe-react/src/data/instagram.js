/**
 * LATEST ON INSTAGRAM (Membership page): the five tiles, newest first.
 *
 * To update:
 *   1. Open each post on instagram.com and copy its link from the address bar,
 *      e.g. "https://www.instagram.com/p/ABC123xyz/" (anything after "?" can go).
 *   2. Save the post's image into  public/assets/images/instagram/  and put its
 *      path in `image`. (Without logging in: open the link with /embed/ added,
 *      e.g. https://www.instagram.com/p/ABC123xyz/embed/, and save the picture.)
 *      Then run `node scripts/optimize-images.mjs` to make right-sized copies.
 *   3. `caption` is a short description for screen readers.
 *   4. Optional `focus` picks which part of a tall image shows in the square tile,
 *      e.g. "center top" for a flyer whose headline is at the top.
 *
 * A post without an image shows the placeholder tile, still linking to the post.
 * An entry without a url links to the @utshpe profile.
 */

export const instagramPosts = [
  { url: "https://www.instagram.com/reel/DeuWQ5SBRBn/", image: "/assets/images/instagram/post1.jpg", caption: "How SHPE is pulling up to the GM", focus: "center 55%" },
  { url: "https://www.instagram.com/p/DepwugShYyq/", image: "/assets/images/instagram/post2.jpg", caption: "Spooky season: General Meeting #5", focus: "center 30%" },
  { url: "https://www.instagram.com/p/DeiBwH_mSxE/", image: "/assets/images/instagram/post3.jpg", caption: "The eyes of Texas were upon our GM #4", focus: "center" },
  { url: "https://www.instagram.com/p/DeZlYMrlADX/", image: "/assets/images/instagram/post4.jpg", caption: "This week in SHPE", focus: "center top" },
  { url: "https://www.instagram.com/p/DeSFgdlTMZe/", image: "/assets/images/instagram/post5.jpg", caption: "ASME x SHPE study abroad info session and student panel", focus: "center 25%" },
];
