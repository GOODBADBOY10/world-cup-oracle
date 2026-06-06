export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  group?: string;
  round: "group" | "r32" | "r16" | "qf" | "sf" | "third" | "final";
  kickoff: string;
  result?: {
    homeScore: number;
    awayScore: number;
    winner: string | "draw";
    finished: boolean;
  };
}

export const MATCHES: Match[] = [
  // ── Group A ──
  { id: "g-a1", homeTeam: "Mexico", awayTeam: "South Africa", homeFlag: "🇲🇽", awayFlag: "🇿🇦", group: "A", round: "group", kickoff: "2026-06-11T20:00:00Z" },
  { id: "g-a2", homeTeam: "South Korea", awayTeam: "Czechia", homeFlag: "🇰🇷", awayFlag: "🇨🇿", group: "A", round: "group", kickoff: "2026-06-12T03:00:00Z" },
  { id: "g-a3", homeTeam: "Czechia", awayTeam: "South Africa", homeFlag: "🇨🇿", awayFlag: "🇿🇦", group: "A", round: "group", kickoff: "2026-06-18T17:00:00Z" },
  { id: "g-a4", homeTeam: "Mexico", awayTeam: "South Korea", homeFlag: "🇲🇽", awayFlag: "🇰🇷", group: "A", round: "group", kickoff: "2026-06-19T02:00:00Z" },
  { id: "g-a5", homeTeam: "South Africa", awayTeam: "South Korea", homeFlag: "🇿🇦", awayFlag: "🇰🇷", group: "A", round: "group", kickoff: "2026-06-25T02:00:00Z" },
  { id: "g-a6", homeTeam: "Czechia", awayTeam: "Mexico", homeFlag: "🇨🇿", awayFlag: "🇲🇽", group: "A", round: "group", kickoff: "2026-06-25T02:00:00Z" },

  // ── Group B ──
  { id: "g-b1", homeTeam: "Canada", awayTeam: "Bosnia and Herzegovina", homeFlag: "🇨🇦", awayFlag: "🇧🇦", group: "B", round: "group", kickoff: "2026-06-12T20:00:00Z" },
  { id: "g-b2", homeTeam: "Qatar", awayTeam: "Switzerland", homeFlag: "🇶🇦", awayFlag: "🇨🇭", group: "B", round: "group", kickoff: "2026-06-13T20:00:00Z" },
  { id: "g-b3", homeTeam: "Switzerland", awayTeam: "Bosnia and Herzegovina", homeFlag: "🇨🇭", awayFlag: "🇧🇦", group: "B", round: "group", kickoff: "2026-06-18T20:00:00Z" },
  { id: "g-b4", homeTeam: "Canada", awayTeam: "Qatar", homeFlag: "🇨🇦", awayFlag: "🇶🇦", group: "B", round: "group", kickoff: "2026-06-18T23:00:00Z" },
  { id: "g-b5", homeTeam: "Switzerland", awayTeam: "Canada", homeFlag: "🇨🇭", awayFlag: "🇨🇦", group: "B", round: "group", kickoff: "2026-06-24T20:00:00Z" },
  { id: "g-b6", homeTeam: "Bosnia and Herzegovina", awayTeam: "Qatar", homeFlag: "🇧🇦", awayFlag: "🇶🇦", group: "B", round: "group", kickoff: "2026-06-24T20:00:00Z" },

  // ── Group C ──
  { id: "g-c1", homeTeam: "Brazil", awayTeam: "Morocco", homeFlag: "🇧🇷", awayFlag: "🇲🇦", group: "C", round: "group", kickoff: "2026-06-13T23:00:00Z" },
  { id: "g-c2", homeTeam: "Haiti", awayTeam: "Scotland", homeFlag: "🇭🇹", awayFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C", round: "group", kickoff: "2026-06-14T02:00:00Z" },
  { id: "g-c3", homeTeam: "Scotland", awayTeam: "Morocco", homeFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", awayFlag: "🇲🇦", group: "C", round: "group", kickoff: "2026-06-19T23:00:00Z" },
  { id: "g-c4", homeTeam: "Brazil", awayTeam: "Haiti", homeFlag: "🇧🇷", awayFlag: "🇭🇹", group: "C", round: "group", kickoff: "2026-06-20T01:30:00Z" },
  { id: "g-c5", homeTeam: "Morocco", awayTeam: "Haiti", homeFlag: "🇲🇦", awayFlag: "🇭🇹", group: "C", round: "group", kickoff: "2026-06-24T23:00:00Z" },
  { id: "g-c6", homeTeam: "Scotland", awayTeam: "Brazil", homeFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", awayFlag: "🇧🇷", group: "C", round: "group", kickoff: "2026-06-24T23:00:00Z" },

  // ── Group D ──
  { id: "g-d1", homeTeam: "USA", awayTeam: "Paraguay", homeFlag: "🇺🇸", awayFlag: "🇵🇾", group: "D", round: "group", kickoff: "2026-06-13T02:00:00Z" },
  { id: "g-d2", homeTeam: "Australia", awayTeam: "Türkiye", homeFlag: "🇦🇺", awayFlag: "🇹🇷", group: "D", round: "group", kickoff: "2026-06-14T05:00:00Z" },
  { id: "g-d3", homeTeam: "USA", awayTeam: "Australia", homeFlag: "🇺🇸", awayFlag: "🇦🇺", group: "D", round: "group", kickoff: "2026-06-19T20:00:00Z" },
  { id: "g-d4", homeTeam: "Türkiye", awayTeam: "Paraguay", homeFlag: "🇹🇷", awayFlag: "🇵🇾", group: "D", round: "group", kickoff: "2026-06-20T04:00:00Z" },
  { id: "g-d5", homeTeam: "Türkiye", awayTeam: "USA", homeFlag: "🇹🇷", awayFlag: "🇺🇸", group: "D", round: "group", kickoff: "2026-06-26T03:00:00Z" },
  { id: "g-d6", homeTeam: "Paraguay", awayTeam: "Australia", homeFlag: "🇵🇾", awayFlag: "🇦🇺", group: "D", round: "group", kickoff: "2026-06-26T03:00:00Z" },

  // ── Group E ──
  { id: "g-e1", homeTeam: "Germany", awayTeam: "Curaçao", homeFlag: "🇩🇪", awayFlag: "🇨🇼", group: "E", round: "group", kickoff: "2026-06-14T18:00:00Z" },
  { id: "g-e2", homeTeam: "Ivory Coast", awayTeam: "Ecuador", homeFlag: "🇨🇮", awayFlag: "🇪🇨", group: "E", round: "group", kickoff: "2026-06-15T00:00:00Z" },
  { id: "g-e3", homeTeam: "Germany", awayTeam: "Ivory Coast", homeFlag: "🇩🇪", awayFlag: "🇨🇮", group: "E", round: "group", kickoff: "2026-06-20T21:00:00Z" },
  { id: "g-e4", homeTeam: "Ecuador", awayTeam: "Curaçao", homeFlag: "🇪🇨", awayFlag: "🇨🇼", group: "E", round: "group", kickoff: "2026-06-21T01:00:00Z" },
  { id: "g-e5", homeTeam: "Curaçao", awayTeam: "Ivory Coast", homeFlag: "🇨🇼", awayFlag: "🇨🇮", group: "E", round: "group", kickoff: "2026-06-25T21:00:00Z" },
  { id: "g-e6", homeTeam: "Ecuador", awayTeam: "Germany", homeFlag: "🇪🇨", awayFlag: "🇩🇪", group: "E", round: "group", kickoff: "2026-06-25T21:00:00Z" },

  // ── Group F ──
  { id: "g-f1", homeTeam: "Netherlands", awayTeam: "Japan", homeFlag: "🇳🇱", awayFlag: "🇯🇵", group: "F", round: "group", kickoff: "2026-06-14T21:00:00Z" },
  { id: "g-f2", homeTeam: "Sweden", awayTeam: "Tunisia", homeFlag: "🇸🇪", awayFlag: "🇹🇳", group: "F", round: "group", kickoff: "2026-06-15T03:00:00Z" },
  { id: "g-f3", homeTeam: "Netherlands", awayTeam: "Sweden", homeFlag: "🇳🇱", awayFlag: "🇸🇪", group: "F", round: "group", kickoff: "2026-06-20T18:00:00Z" },
  { id: "g-f4", homeTeam: "Tunisia", awayTeam: "Japan", homeFlag: "🇹🇳", awayFlag: "🇯🇵", group: "F", round: "group", kickoff: "2026-06-21T05:00:00Z" },
  { id: "g-f5", homeTeam: "Tunisia", awayTeam: "Netherlands", homeFlag: "🇹🇳", awayFlag: "🇳🇱", group: "F", round: "group", kickoff: "2026-06-26T00:00:00Z" },
  { id: "g-f6", homeTeam: "Japan", awayTeam: "Sweden", homeFlag: "🇯🇵", awayFlag: "🇸🇪", group: "F", round: "group", kickoff: "2026-06-26T00:00:00Z" },

  // ── Group G ──
  { id: "g-g1", homeTeam: "Belgium", awayTeam: "Egypt", homeFlag: "🇧🇪", awayFlag: "🇪🇬", group: "G", round: "group", kickoff: "2026-06-15T20:00:00Z" },
  { id: "g-g2", homeTeam: "Iran", awayTeam: "New Zealand", homeFlag: "🇮🇷", awayFlag: "🇳🇿", group: "G", round: "group", kickoff: "2026-06-16T02:00:00Z" },
  { id: "g-g3", homeTeam: "Belgium", awayTeam: "Iran", homeFlag: "🇧🇪", awayFlag: "🇮🇷", group: "G", round: "group", kickoff: "2026-06-21T20:00:00Z" },
  { id: "g-g4", homeTeam: "New Zealand", awayTeam: "Egypt", homeFlag: "🇳🇿", awayFlag: "🇪🇬", group: "G", round: "group", kickoff: "2026-06-22T02:00:00Z" },
  { id: "g-g5", homeTeam: "New Zealand", awayTeam: "Belgium", homeFlag: "🇳🇿", awayFlag: "🇧🇪", group: "G", round: "group", kickoff: "2026-06-27T04:00:00Z" },
  { id: "g-g6", homeTeam: "Egypt", awayTeam: "Iran", homeFlag: "🇪🇬", awayFlag: "🇮🇷", group: "G", round: "group", kickoff: "2026-06-27T04:00:00Z" },

  // ── Group H ──
  { id: "g-h1", homeTeam: "Spain", awayTeam: "Cape Verde", homeFlag: "🇪🇸", awayFlag: "🇨🇻", group: "H", round: "group", kickoff: "2026-06-15T17:00:00Z" },
  { id: "g-h2", homeTeam: "Saudi Arabia", awayTeam: "Uruguay", homeFlag: "🇸🇦", awayFlag: "🇺🇾", group: "H", round: "group", kickoff: "2026-06-15T23:00:00Z" },
  { id: "g-h3", homeTeam: "Spain", awayTeam: "Saudi Arabia", homeFlag: "🇪🇸", awayFlag: "🇸🇦", group: "H", round: "group", kickoff: "2026-06-21T17:00:00Z" },
  { id: "g-h4", homeTeam: "Uruguay", awayTeam: "Cape Verde", homeFlag: "🇺🇾", awayFlag: "🇨🇻", group: "H", round: "group", kickoff: "2026-06-21T23:00:00Z" },
  { id: "g-h5", homeTeam: "Cape Verde", awayTeam: "Saudi Arabia", homeFlag: "🇨🇻", awayFlag: "🇸🇦", group: "H", round: "group", kickoff: "2026-06-27T01:00:00Z" },
  { id: "g-h6", homeTeam: "Uruguay", awayTeam: "Spain", homeFlag: "🇺🇾", awayFlag: "🇪🇸", group: "H", round: "group", kickoff: "2026-06-27T01:00:00Z" },

  // ── Group I ──
  { id: "g-i1", homeTeam: "France", awayTeam: "Senegal", homeFlag: "🇫🇷", awayFlag: "🇸🇳", group: "I", round: "group", kickoff: "2026-06-16T20:00:00Z" },
  { id: "g-i2", homeTeam: "Iraq", awayTeam: "Norway", homeFlag: "🇮🇶", awayFlag: "🇳🇴", group: "I", round: "group", kickoff: "2026-06-16T23:00:00Z" },
  { id: "g-i3", homeTeam: "France", awayTeam: "Iraq", homeFlag: "🇫🇷", awayFlag: "🇮🇶", group: "I", round: "group", kickoff: "2026-06-22T22:00:00Z" },
  { id: "g-i4", homeTeam: "Norway", awayTeam: "Senegal", homeFlag: "🇳🇴", awayFlag: "🇸🇳", group: "I", round: "group", kickoff: "2026-06-23T01:00:00Z" },
  { id: "g-i5", homeTeam: "Norway", awayTeam: "France", homeFlag: "🇳🇴", awayFlag: "🇫🇷", group: "I", round: "group", kickoff: "2026-06-26T20:00:00Z" },
  { id: "g-i6", homeTeam: "Senegal", awayTeam: "Iraq", homeFlag: "🇸🇳", awayFlag: "🇮🇶", group: "I", round: "group", kickoff: "2026-06-26T20:00:00Z" },

  // ── Group J ──
  { id: "g-j1", homeTeam: "Argentina", awayTeam: "Algeria", homeFlag: "🇦🇷", awayFlag: "🇩🇿", group: "J", round: "group", kickoff: "2026-06-17T02:00:00Z" },
  { id: "g-j2", homeTeam: "Austria", awayTeam: "Jordan", homeFlag: "🇦🇹", awayFlag: "🇯🇴", group: "J", round: "group", kickoff: "2026-06-17T05:00:00Z" },
  { id: "g-j3", homeTeam: "Argentina", awayTeam: "Austria", homeFlag: "🇦🇷", awayFlag: "🇦🇹", group: "J", round: "group", kickoff: "2026-06-22T18:00:00Z" },
  { id: "g-j4", homeTeam: "Jordan", awayTeam: "Algeria", homeFlag: "🇯🇴", awayFlag: "🇩🇿", group: "J", round: "group", kickoff: "2026-06-23T04:00:00Z" },
  { id: "g-j5", homeTeam: "Algeria", awayTeam: "Austria", homeFlag: "🇩🇿", awayFlag: "🇦🇹", group: "J", round: "group", kickoff: "2026-06-28T03:00:00Z" },
  { id: "g-j6", homeTeam: "Jordan", awayTeam: "Argentina", homeFlag: "🇯🇴", awayFlag: "🇦🇷", group: "J", round: "group", kickoff: "2026-06-28T03:00:00Z" },

  // ── Group K ──
  { id: "g-k1", homeTeam: "Portugal", awayTeam: "DR Congo", homeFlag: "🇵🇹", awayFlag: "🇨🇩", group: "K", round: "group", kickoff: "2026-06-17T18:00:00Z" },
  { id: "g-k2", homeTeam: "Uzbekistan", awayTeam: "Colombia", homeFlag: "🇺🇿", awayFlag: "🇨🇴", group: "K", round: "group", kickoff: "2026-06-18T03:00:00Z" },
  { id: "g-k3", homeTeam: "Portugal", awayTeam: "Uzbekistan", homeFlag: "🇵🇹", awayFlag: "🇺🇿", group: "K", round: "group", kickoff: "2026-06-23T18:00:00Z" },
  { id: "g-k4", homeTeam: "Colombia", awayTeam: "DR Congo", homeFlag: "🇨🇴", awayFlag: "🇨🇩", group: "K", round: "group", kickoff: "2026-06-24T03:00:00Z" },
  { id: "g-k5", homeTeam: "Colombia", awayTeam: "Portugal", homeFlag: "🇨🇴", awayFlag: "🇵🇹", group: "K", round: "group", kickoff: "2026-06-28T00:30:00Z" },
  { id: "g-k6", homeTeam: "DR Congo", awayTeam: "Uzbekistan", homeFlag: "🇨🇩", awayFlag: "🇺🇿", group: "K", round: "group", kickoff: "2026-06-28T00:30:00Z" },

  // ── Group L ──
  { id: "g-l1", homeTeam: "England", awayTeam: "Croatia", homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayFlag: "🇭🇷", group: "L", round: "group", kickoff: "2026-06-17T21:00:00Z" },
  { id: "g-l2", homeTeam: "Ghana", awayTeam: "Panama", homeFlag: "🇬🇭", awayFlag: "🇵🇦", group: "L", round: "group", kickoff: "2026-06-18T00:00:00Z" },
  { id: "g-l3", homeTeam: "England", awayTeam: "Ghana", homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayFlag: "🇬🇭", group: "L", round: "group", kickoff: "2026-06-23T21:00:00Z" },
  { id: "g-l4", homeTeam: "Panama", awayTeam: "Croatia", homeFlag: "🇵🇦", awayFlag: "🇭🇷", group: "L", round: "group", kickoff: "2026-06-24T00:00:00Z" },
  { id: "g-l5", homeTeam: "Panama", awayTeam: "England", homeFlag: "🇵🇦", awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L", round: "group", kickoff: "2026-06-27T22:00:00Z" },
  { id: "g-l6", homeTeam: "Croatia", awayTeam: "Ghana", homeFlag: "🇭🇷", awayFlag: "🇬🇭", group: "L", round: "group", kickoff: "2026-06-27T22:00:00Z" },

  // ── Round of 32 ──
  { id: "r32-1", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-06-28T20:00:00Z" },
  { id: "r32-2", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-06-29T18:00:00Z" },
  { id: "r32-3", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-06-29T21:30:00Z" },
  { id: "r32-4", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-06-30T02:00:00Z" },
  { id: "r32-5", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-06-30T18:00:00Z" },
  { id: "r32-6", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-06-30T22:00:00Z" },
  { id: "r32-7", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-07-01T02:00:00Z" },
  { id: "r32-8", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-07-01T17:00:00Z" },
  { id: "r32-9", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-07-01T21:00:00Z" },
  { id: "r32-10", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-07-02T01:00:00Z" },
  { id: "r32-11", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-07-02T20:00:00Z" },
  { id: "r32-12", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-07-03T00:00:00Z" },
  { id: "r32-13", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-07-03T04:00:00Z" },
  { id: "r32-14", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-07-03T19:00:00Z" },
  { id: "r32-15", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-07-03T23:00:00Z" },
  { id: "r32-16", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r32", kickoff: "2026-07-04T02:30:00Z" },

  // ── Round of 16 ──
  { id: "r16-1", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r16", kickoff: "2026-07-04T18:00:00Z" },
  { id: "r16-2", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r16", kickoff: "2026-07-04T22:00:00Z" },
  { id: "r16-3", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r16", kickoff: "2026-07-05T21:00:00Z" },
  { id: "r16-4", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r16", kickoff: "2026-07-06T01:00:00Z" },
  { id: "r16-5", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r16", kickoff: "2026-07-06T20:00:00Z" },
  { id: "r16-6", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r16", kickoff: "2026-07-07T01:00:00Z" },
  { id: "r16-7", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r16", kickoff: "2026-07-07T17:00:00Z" },
  { id: "r16-8", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "r16", kickoff: "2026-07-07T21:00:00Z" },

  // ── Quarter-finals ──
  { id: "qf-1", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "qf", kickoff: "2026-07-09T21:00:00Z" },
  { id: "qf-2", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "qf", kickoff: "2026-07-10T20:00:00Z" },
  { id: "qf-3", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "qf", kickoff: "2026-07-11T22:00:00Z" },
  { id: "qf-4", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "qf", kickoff: "2026-07-12T02:00:00Z" },

  // ── Semi-finals ──
  { id: "sf-1", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "sf", kickoff: "2026-07-14T20:00:00Z" },
  { id: "sf-2", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "sf", kickoff: "2026-07-15T20:00:00Z" },

  // ── Third place ──
  { id: "third", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "third", kickoff: "2026-07-18T22:00:00Z" },

  // ── Final ──
  { id: "final", homeTeam: "TBD", awayTeam: "TBD", homeFlag: "🏳️", awayFlag: "🏳️", round: "final", kickoff: "2026-07-19T20:00:00Z" },
];

export function getUpcomingMatches(): Match[] {
  const now = new Date();
  return MATCHES.filter((m) => new Date(m.kickoff) > now && m.homeTeam !== "TBD").slice(0, 12);
}

export function getRecentMatches(): Match[] {
  const now = new Date();
  return MATCHES.filter((m) => new Date(m.kickoff) <= now || m.result?.finished).slice(-5).reverse();
}

export function getMatchById(id: string): Match | undefined {
  return MATCHES.find((m) => m.id === id);
}

export const ROUND_LABELS: Record<string, string> = {
  group: "Group Stage",
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarter-final",
  sf: "Semi-final",
  third: "Third Place",
  final: "Final",
};