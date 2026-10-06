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
 *   focus   (optional) CSS object-position used to keep faces in frame
 *                      when the photo is cropped, e.g. "center top".
 *
 * The FIRST entry is the large feature tile, so put the best photo there.
 * The layout is designed for 3 to 6 entries.
 */

// Where the "See More of Us" button below the collage links to.
export const FLICKR_PROFILE_URL = "https://www.flickr.com/photos/201375415@N03/";

const thisWeek = [
  {
    image: "/assets/images/this-week/general-meeting.jpg",
    caption: "General Meetings",
    // People are in the lower part; 60% (not 65%) keeps the back row
    // in frame on the wide tablet tile.
    focus: "center 60%",
  },
  {
    image: "/assets/images/this-week/intramural-sports.jpg",
    caption: "Intramural Sports",
    focus: "center 45%",
  },
  {
    image: "/assets/images/this-week/company-info-session.jpg",
    caption: "Company Info Sessions",
    focus: "center 45%",
  },
  {
    image: "/assets/images/this-week/carne-asada.jpg",
    caption: "SHPE Carne Asada",
    focus: "center 50%",
  },
  {
    image: "/assets/images/this-week/technical-workshop.jpg",
    caption: "Technical Workshops",
    focus: "center 55%",
  },
  {
    image: "/assets/images/aboutus/ChapterOutreach.jpg",
    caption: "Volunteering",
  },
];

export default thisWeek;
