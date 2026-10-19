/**
 * 2026-2027 LEADERSHIP (the Leadership page's flip postcards).
 *
 * Fields: name, role, major, year, plus optional
 *   pronouns, image (public path), focus (object-position), linkedin, email.
 * Without an image the card shows the navy silhouette. Without an email the
 * card's mail button uses <first name>@utexas.edu, as the design does.
 */

const PHOTOS = "/assets/images/Leadership";

export const executiveBoard = [
  { name: "Yessenia Martin", role: "President", major: "Computer Science", year: "4th year", image: `${PHOTOS}/Yessenia.png`, focus: "center 70%", linkedin: "https://www.linkedin.com/in/yessenia-martin/", email: "yesseniamartin@utexas.edu" },
  { name: "Alexandra Galindo", role: "Vice President External", major: "Electrical and Computer Engineering", year: "4th year", image: `${PHOTOS}/Alexandra.png`, focus: "center 70%", linkedin: "https://www.linkedin.com/in/galindo3553/", email: "agalindo3553@utexas.edu" },
  { name: "Carlos Cortez", role: "Vice President Internal", major: "Mechanical Engineering", year: "4th year" },
  { name: "Mia Yonker", role: "Secretary", major: "Computer Science", year: "2nd year" },
  { name: "Sophia Munoz", role: "Treasurer", major: "Mechanical Engineering", year: "4th year" },
];

export const boardOfDirectors = [
  { name: "Clarissa", role: "Academic Director", major: "Mechanical Engineering", year: "4th year" },
  { name: "Eliana", role: "Chapter Director", major: "Electrical and Computer Engineering", year: "3rd year" },
  { name: "Adam Flores", role: "Community Outreach Director", major: "Chemical Engineering", year: "3rd year" },
  { name: "Zoe", role: "Leadership Director", major: "Mechanical Engineering", year: "2nd year" },
  { name: "Nathan", role: "Professional Director", major: "Electrical and Computer Engineering", year: "3rd year" },
  { name: "Natalia", role: "SHPEtina Director", major: "Civil Engineering", year: "3rd year" },
  { name: "Jake", role: "Technical Director", major: "Electrical and Computer Engineering", year: "3rd year" },
];
