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
  { name: "Yessenia Martin", role: "President", major: "Computer Science", year: "4th year", image: `${PHOTOS}/Yessenia-2026.jpg`, focus: "center 35%", linkedin: "https://www.linkedin.com/in/yessenia-martin/", email: "yesseniamartin@utexas.edu" },
  { name: "Alexandra Galindo", role: "Vice President External", major: "Electrical and Computer Engineering", year: "4th year", image: `${PHOTOS}/Alex-2026.jpg`, focus: "center 22%", linkedin: "https://www.linkedin.com/in/galindo3553/", email: "agalindo3553@utexas.edu" },
  { name: "Carlos Cortez", role: "Vice President Internal", major: "Mechanical Engineering", year: "4th year", image: `${PHOTOS}/Carlos-2026.jpg`, focus: "center 20%" },
  { name: "Mia Yonker", role: "Secretary", major: "Computer Science", year: "2nd year", image: `${PHOTOS}/Mia-2026.jpg`, focus: "center 11%" },
  { name: "Sophia Munoz", role: "Treasurer", major: "Mechanical Engineering", year: "4th year", image: `${PHOTOS}/Sophia-2026.jpg`, focus: "center 35%" },
];

export const boardOfDirectors = [
  { name: "Clarissa", role: "Academic Director", major: "Mechanical Engineering", year: "4th year", image: `${PHOTOS}/Clarissa-2026.jpg`, focus: "center 22%" },
  { name: "Eliana", role: "Chapter Director", major: "Electrical and Computer Engineering", year: "3rd year", image: `${PHOTOS}/Eliana-2026.jpg`, focus: "center 35%" },
  { name: "Adam Flores", role: "Community Outreach Director", major: "Chemical Engineering", year: "3rd year", image: `${PHOTOS}/Adam-2026.jpg`, focus: "center 20%" },
  { name: "Zoe", role: "Leadership Director", major: "Mechanical Engineering", year: "2nd year", image: `${PHOTOS}/Zoe-2026.jpg`, focus: "center 35%" },
  { name: "Nathan", role: "Professional Director", major: "Electrical and Computer Engineering", year: "3rd year", image: `${PHOTOS}/Nathan-2026.jpg`, focus: "center 30%" },
  { name: "Natalia", role: "SHPEtina Director", major: "Civil Engineering", year: "3rd year", image: `${PHOTOS}/Natalia-2026.jpg`, focus: "center 35%" },
  { name: "Jake", role: "Technical Director", major: "Electrical and Computer Engineering", year: "3rd year", image: `${PHOTOS}/Jake-2026.jpg`, focus: "center 20%" },
];
