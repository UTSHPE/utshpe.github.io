/* One place for the links the design repeats. */
export const MEMBERSHIP_FORM_URL = "https://forms.gle/HYKRNkM5QAERi4ft5";
export const LEADERBOARD_URL = "https://top-12-website.vercel.app/leaderboard";
export const CHECKIN_URL = "https://top-12-website.vercel.app/checkin";
export const FLICKR_URL = "https://www.flickr.com/photos/201375415@N03/";
export const INSTAGRAM_URL = "https://www.instagram.com/utshpe/";
export const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/embed?src=fe9b8ofqqol1qt5n61b6oj3o4c%40group.calendar.google.com&ctz=America%2FChicago";
export const SPONSOR_PACKET_URL = "https://utshpe.us/assets/files/UT%20SHPE%2026-27%20Corporate%20Solicitation%20Packet.pdf";

/*
 * Development aid for visual diffing against the design (scripts/compare.mjs):
 * VITE_PLACEHOLDER_PHOTOS=1 renders the design's colored placeholder tiles instead of photos.
 */
export const PLACEHOLDER_PHOTOS = import.meta.env.VITE_PLACEHOLDER_PHOTOS === "1";
export const photo = (src) => (PLACEHOLDER_PHOTOS ? undefined : src);
