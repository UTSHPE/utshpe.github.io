/*
 * THIS WEEK IN SHPE — hand-curated home page collage.
 *
 * How to update it each week:
 *   1. Drop the new photos into  public/assets/images/this-week/
 *   2. Edit the array below. Paths start at /assets/... (no "public").
 *
 * Fields:
 *   image   (required) Path to the photo.
 *   caption (required) Short label shown on the tile; also used as alt text.
 *   pillar  (optional) Shown as a small tag. Use one of the PILLARS below.
 *   focus   (optional) CSS object-position used to keep faces in frame
 *                      when the photo is cropped, e.g. "center top".
 *
 * The FIRST entry is the large feature tile, so put the best photo there.
 * The layout is designed for 3 to 6 entries.
 */

export const PILLARS = [
  "Academic Development",
  "Chapter Development",
  "Community Outreach",
  "Leadership Development",
  "Professional Development",
  "Technical Development",
];

// Where the "See More of Us" button below the collage links to.
export const FLICKR_PROFILE_URL = "https://www.flickr.com/photos/201375415@N03/";

const thisWeek = [
  {
    image: "/assets/images/Home_Page/slideshow1.jpg",
    caption: "General Meeting",
    pillar: "Chapter Development",
  },
  {
    image: "/assets/images/aboutus/ChapterOutreach.jpg",
    caption: "Volunteering",
    pillar: "Community Outreach",
  },
  {
    image: "/assets/images/Home_Page/slideshow2.jpg",
    caption: "Intramural Sports",
  },
  {
    image: "/assets/images/aboutus/Academic.jpg",
    caption: "Study Night",
    pillar: "Academic Development",
  },
  {
    image: "/assets/images/aboutus/ProfessionalDevelopment.png",
    caption: "Company Info Session",
    pillar: "Professional Development",
  },
  {
    image: "/assets/images/aboutus/Leadership.jpg",
    caption: "Officer Workshop",
    pillar: "Leadership Development",
    focus: "center top",
  },
];

export default thisWeek;
