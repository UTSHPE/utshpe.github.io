/**
 * OFFICER / CHAIR / MEMBER / SHPEtina OF THE MONTH
 *
 * Each month, edit spotlightMonth and the four entries below:
 *   - name:  person's full name
 *   - major: their major
 *   - year:  e.g. "3rd Year" (shown on the back of the postcard)
 *   - image: path to their photo
 *
 * Photos go in  public/assets/images/spotlight/  and the path starts
 * with /assets/... (no "public"). A portrait photo works best.
 * Optional: focus: CSS object-position to keep a face in frame, e.g. "center 30%".
 *
 * Shown on Home, Membership ("Members to know") and SHPEtinas (the SHPEtina entry).
 */

export const spotlightMonth = "October 2026";

export const spotlights = [
  {
    title: "Officer of the Month",
    name: "Adam Flores",
    major: "Chemical Engineering",
    year: "3rd Year",
    image: "/assets/images/spotlight/officer-of-the-month.jpg",
  },
  {
    title: "Chair of the Month",
    name: "Anthony Cardozo",
    major: "Computer Science",
    year: "2nd Year",
    image: "/assets/images/spotlight/chair-of-the-month.jpg",
  },
  {
    title: "Member of the Month",
    name: "Sofia Madrigal",
    major: "Computational Engineering",
    year: "1st Year",
    image: "/assets/images/spotlight/member-of-the-month.jpg",
  },
  {
    title: "SHPEtina of the Month",
    name: "Harshil Goyal",
    major: "Computer Science",
    year: "1st Year",
    image: "/assets/images/spotlight/shpetina-of-the-month.png",
  },
];
