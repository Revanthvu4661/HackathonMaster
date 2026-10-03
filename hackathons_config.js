// Offline / last-resort fallback (15 entries, same schema as data/hackathons.json).
// The page hides any entry whose deadline has passed, so stale items disappear on their own.
// Refresh occasionally by copying entries from data/hackathons.json.
const FALLBACK_HACKATHONS = [
  {
    "id": "unstop-flipkart-grid",
    "name": "Flipkart GRiD",
    "platform": "Unstop",
    "theme": "E-commerce / AI",
    "prize": "Cash + PPO",
    "prize_numeric": 0,
    "deadline": null,
    "deadline_ts": null,
    "duration": "Varies",
    "mode": "Online",
    "teamSize": "1-3",
    "link": "https://unstop.com/hackathons",
    "status": "Live",
    "tags": [
      "Unstop",
      "AI/ML",
      "Annual"
    ],
    "source": "unstop",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "unstop-google-solution-challenge",
    "name": "Google Solution Challenge",
    "platform": "Unstop",
    "theme": "UN SDGs",
    "prize": "Mentorship + Google support",
    "prize_numeric": 0,
    "deadline": null,
    "deadline_ts": null,
    "duration": "Varies",
    "mode": "Online",
    "teamSize": "1-4",
    "link": "https://developers.google.com/community/gdsc-solution-challenge",
    "status": "Live",
    "tags": [
      "Google",
      "Students",
      "Annual"
    ],
    "source": "unstop",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "unstop-microsoft-imagine-cup",
    "name": "Microsoft Imagine Cup",
    "platform": "Unstop",
    "theme": "AI / Cloud",
    "prize": "$100,000",
    "prize_numeric": 100000,
    "deadline": null,
    "deadline_ts": null,
    "duration": "Varies",
    "mode": "Online",
    "teamSize": "1-4",
    "link": "https://imaginecup.microsoft.com/",
    "status": "Live",
    "tags": [
      "Microsoft",
      "Students",
      "Annual"
    ],
    "source": "unstop",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "unstop-nasa-international-space-apps-challenge",
    "name": "NASA International Space Apps Challenge",
    "platform": "Unstop",
    "theme": "Space Tech",
    "prize": "Global Recognition",
    "prize_numeric": 0,
    "deadline": null,
    "deadline_ts": null,
    "duration": "Varies",
    "mode": "Hybrid",
    "teamSize": "1-6",
    "link": "https://www.spaceappschallenge.org/",
    "status": "Live",
    "tags": [
      "Space Tech",
      "Open Data",
      "Annual"
    ],
    "source": "unstop",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "unstop-smart-india-hackathon-sih",
    "name": "Smart India Hackathon (SIH)",
    "platform": "Unstop",
    "theme": "Open Innovation",
    "prize": "₹1,00,000 per problem statement",
    "prize_numeric": 1200,
    "deadline": null,
    "deadline_ts": null,
    "duration": "Varies",
    "mode": "Hybrid",
    "teamSize": "6",
    "link": "https://www.sih.gov.in/",
    "status": "Live",
    "tags": [
      "India",
      "Government",
      "Annual"
    ],
    "source": "unstop",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "unstop-unstop-hackathons-hub",
    "name": "Unstop Hackathons Hub",
    "platform": "Unstop",
    "theme": "Open Theme",
    "prize": "Varies",
    "prize_numeric": 0,
    "deadline": null,
    "deadline_ts": null,
    "duration": "Varies",
    "mode": "Online",
    "teamSize": "1-4",
    "link": "https://unstop.com/hackathons",
    "status": "Live",
    "tags": [
      "Unstop",
      "Open Theme",
      "Rolling"
    ],
    "source": "unstop",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "devfolio-hack-with-gdg-s4",
    "name": "HACK WITH GDG S4",
    "platform": "Devfolio",
    "theme": "Open Theme",
    "prize": "See details",
    "prize_numeric": 0,
    "deadline": "2026-12-31",
    "deadline_ts": 1798741740,
    "duration": "36h",
    "mode": "In-person",
    "teamSize": "1-4",
    "link": "https://hack-with-gdg-s4.devfolio.co/",
    "status": "Upcoming",
    "tags": [
      "KSR Kalvi Nagar",
      "Open"
    ],
    "source": "devfolio",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "devfolio-devnexus2",
    "name": "DevNexus 2.0",
    "platform": "Devfolio",
    "theme": "Open Theme",
    "prize": "See details",
    "prize_numeric": 0,
    "deadline": "2026-11-14",
    "deadline_ts": 1794681000,
    "duration": "24h",
    "mode": "In-person",
    "teamSize": "2-4",
    "link": "https://devnexus2.devfolio.co/",
    "status": "Upcoming",
    "tags": [
      "Kolkata",
      "Open"
    ],
    "source": "devfolio",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "devfolio-haxfinity",
    "name": "haxfinity",
    "platform": "Devfolio",
    "theme": "Open Theme",
    "prize": "See details",
    "prize_numeric": 0,
    "deadline": "2026-11-10",
    "deadline_ts": 1794335340,
    "duration": "24h",
    "mode": "In-person",
    "teamSize": "2-4",
    "link": "https://haxfinity.devfolio.co/",
    "status": "Upcoming",
    "tags": [
      "Myladi",
      "Open"
    ],
    "source": "devfolio",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "devpost-hack47-offgrid",
    "name": "HACK47: OFFGRID",
    "platform": "DevPost",
    "theme": "Enterprise",
    "prize": "See details",
    "prize_numeric": 0,
    "deadline": "2026-10-15",
    "deadline_ts": 1792108799,
    "duration": "31d",
    "mode": "Online",
    "teamSize": "Varies",
    "link": "https://hack47-offgrid.devpost.com/",
    "status": "Live",
    "tags": [
      "Enterprise",
      "Open Ended",
      "Robotic Process Automation",
      "Open"
    ],
    "source": "devpost",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "devpost-multimodal-ai-hackathon-2026-7",
    "name": "Multimodal AI Hackathon 2026",
    "platform": "DevPost",
    "theme": "Machine Learning/AI",
    "prize": "₹ 100,000",
    "prize_numeric": 1200,
    "deadline": "2026-10-14",
    "deadline_ts": 1792022399,
    "duration": "16d",
    "mode": "Online",
    "teamSize": "Varies",
    "link": "https://multimodal-ai-hackathon-2026-7.devpost.com/",
    "status": "Live",
    "tags": [
      "Machine Learning/AI",
      "Open"
    ],
    "source": "devpost",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "devpost-warriorhacks-2-0",
    "name": "WarriorHacks 2.0",
    "platform": "DevPost",
    "theme": "Beginner Friendly",
    "prize": "See details",
    "prize_numeric": 0,
    "deadline": "2026-10-14",
    "deadline_ts": 1792022399,
    "duration": "17d",
    "mode": "Online",
    "teamSize": "Varies",
    "link": "https://warriorhacks-2-0.devpost.com/",
    "status": "Live",
    "tags": [
      "Beginner Friendly",
      "Machine Learning/AI",
      "Open Ended",
      "Open"
    ],
    "source": "devpost",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "mlh-la-hacks-27",
    "name": "LA Hacks 27",
    "platform": "MLH",
    "theme": "Student Hackathon",
    "prize": "See details",
    "prize_numeric": 0,
    "deadline": "2027-04-18",
    "deadline_ts": 1808092799,
    "duration": "71h",
    "mode": "In-person",
    "teamSize": "Varies",
    "link": "https://lahacks.com",
    "status": "Upcoming",
    "tags": [
      "MLH",
      "Students",
      "Los Angeles, California"
    ],
    "source": "mlh",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "mlh-hackku27",
    "name": "HackKU27",
    "platform": "MLH",
    "theme": "Student Hackathon",
    "prize": "See details",
    "prize_numeric": 0,
    "deadline": "2027-04-11",
    "deadline_ts": 1807487999,
    "duration": "71h",
    "mode": "In-person",
    "teamSize": "Varies",
    "link": "https://www.hackku.org/",
    "status": "Upcoming",
    "tags": [
      "MLH",
      "Students",
      "Lawrence, Kansas"
    ],
    "source": "mlh",
    "last_updated": "2026-09-30T03:28:11Z"
  },
  {
    "id": "mlh-wehack-36",
    "name": "WEHack",
    "platform": "MLH",
    "theme": "Student Hackathon",
    "prize": "See details",
    "prize_numeric": 0,
    "deadline": "2027-04-11",
    "deadline_ts": 1807487999,
    "duration": "47h",
    "mode": "In-person",
    "teamSize": "Varies",
    "link": "https://www.wehackutd.com/",
    "status": "Upcoming",
    "tags": [
      "MLH",
      "Students",
      "Richardson, TX"
    ],
    "source": "mlh",
    "last_updated": "2026-09-30T03:28:11Z"
  }
];
