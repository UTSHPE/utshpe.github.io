/*
 * PHOTOS FROM THE FAMILIA: the home page photo grid.
 *
 * How to update it:
 *   1. Drop new photos into  public/assets/images/this-week/
 *   2. Edit the array below. Paths start at /assets/... (no "public").
 *
 * Fields:
 *   image   (required) Path to the photo.
 *   caption (required) Short label shown on the tile; also used as alt text.
 *   focus   (optional) CSS object-position used to keep faces in frame
 *                      when the photo is cropped, e.g. "center top".
 *
 * The grid has seven tiles in a fixed shape (the first is the large one),
 * followed by the orange "See more of us" tile.
 */

// Where the "See More of Us" buttons link to.
export const FLICKR_PROFILE_URL = "https://www.flickr.com/photos/201375415@N03/";

const thisWeek = [
  { image: "/assets/images/this-week/general-meeting.jpg", caption: "General meetings", focus: "center 60%" },
  { image: "/assets/images/this-week/intramural-sports.jpg", caption: "Intramural sports", focus: "center 45%" },
  { image: "/assets/images/this-week/company-info-session.jpg", caption: "Company info sessions", focus: "center 45%" },
  { image: "/assets/images/this-week/carne-asada.jpg", caption: "SHPE carne asada", focus: "center 50%" },
  { image: "/assets/images/this-week/technical-workshop.jpg", caption: "Technical workshops", focus: "center 55%" },
  { image: "/assets/images/aboutus/ChapterOutreach.jpg", caption: "Volunteering" },
  { image: "/assets/images/membership/membership6.jpg", caption: "Social nights" },
];

export default thisWeek;
