/**
 * LeaderSHPE office hours (Home, "Meet the Familia"). From the design, verbatim.
 *
 * OFFICE_HOURS: one list per weekday (Monday to Friday). Each block is
 *   [name, time label, role, year, major, start hour, end hour, (unused)]
 *   Hours are decimal, 9 to 18 (e.g. 12.5 = 12:30 PM).
 * OFFICER_COLORS: name -> [front bg, front text, back bg, back text]
 */

export const OFFICE_HOURS = [
  [["Mia", "10–11", "Secretary", "2nd year", "Computer Science", 10, 11, 0], ["Carlos", "11:30–12:30", "Vice President Internal", "4th year", "Mechanical Engineering", 11.5, 12.5, 1], ["Jake", "12:30–2:30", "Technical Director", "3rd year", "Electrical & Computer Engineering", 12.5, 14.5, 2], ["Alex", "3–5", "Vice President External", "4th year", "Electrical & Computer Engineering", 15, 17, 3]],
  [["Sophia", "10–11", "Treasurer", "4th year", "Mechanical Engineering", 10, 11, 3], ["Nathan", "11–12:30", "Professional Director", "3rd year", "Electrical & Computer Engineering", 11, 12.5, 1], ["Yessenia", "12:30–2:30", "President", "4th year", "Computer Science", 12.5, 14.5, 0], ["Adam", "3–4", "Community Outreach Director", "3rd year", "Chemical Engineering", 15, 16, 2]],
  [["Mia", "10–11", "Secretary", "2nd year", "Computer Science", 10, 11, 0], ["Natalia", "1–3", "SHPEtinas Director", "3rd year", "Civil Engineering", 13, 15, 2], ["Nathan", "4–4:30", "Professional Director", "3rd year", "Electrical & Computer Engineering", 16, 16.5, 1]],
  [["Clarissa", "9:30–11:30", "Academic Director", "4th year", "Mechanical Engineering", 9.5, 11.5, 3], ["Eliana", "11:30–1:30", "Chapter Director", "3rd year", "Electrical & Computer Engineering", 11.5, 13.5, 0], ["Adam", "3–4", "Community Outreach Director", "3rd year", "Chemical Engineering", 15, 16, 2]],
  [["Zoe", "9–11", "Leadership Director", "2nd year", "Mechanical Engineering", 9, 11, 1], ["Sophia", "11–12", "Treasurer", "4th year", "Mechanical Engineering", 11, 12, 3], ["Carlos", "12:30–1:30", "Vice President Internal", "4th year", "Mechanical Engineering", 12.5, 13.5, 2]],
];

export const OFFICER_COLORS = { Mia: ["#F26838", "#0A2350", "#0A2350", "#fff"], Carlos: ["#1272B8", "#fff", "#0A2350", "#fff"], Jake: ["#74ABC2", "#0A2350", "#16316B", "#fff"], Alex: ["#D33E26", "#fff", "#0A2350", "#fff"], Sophia: ["#CFE6EF", "#0A2350", "#1272B8", "#fff"], Nathan: ["#F7A672", "#0A2350", "#D33E26", "#fff"], Yessenia: ["#16316B", "#fff", "#F26838", "#0A2350"], Adam: ["#FBD3C0", "#0A2350", "#D33E26", "#fff"], Natalia: ["#0E4F86", "#fff", "#74ABC2", "#0A2350"], Clarissa: ["#A9CFE0", "#0A2350", "#0A2350", "#fff"], Eliana: ["#E0836B", "#0A2350", "#0A2350", "#fff"], Zoe: ["#3D93CF", "#0A2350", "#F26838", "#0A2350"] };
