export const hackathons = [
  {
    id: 'autodump',
    name: 'AutoDump',
    tagline: 'Autonomous Self-Emptying Trash Rover',
    event: 'MakeCU 2025',
    award: '3rd Place Overall',
    date: 'Nov 2025',
    description:
      'A Raspberry Pi rover that finds full bins, docks itself, and dumps into a central can using computer vision, ArUco localization, and ultrasonic sensing. It runs the whole loop from seeing to acting, with the wheels and dump arm driven by an OpenRB-150 and a couple of Arduinos.',
    tech: ['Raspberry Pi', 'Python', 'OpenCV', 'C++', 'Arduino', 'OpenRB-150', 'ArUco', 'Ultrasonic'],
    image:
      'https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/960/429/datas/original.JPG',
    devpost: 'https://devpost.com/software/autodump-autonomous-self-emptying-trash-rover',
    github: 'https://github.com/RyanQin24/MakeCU',
    team: ['Rohit Biswas', 'Ryan Qin', 'Caesar Zhou', 'Eric Zou'],
  },
  {
    id: 'jamhacks8',
    name: 'Automatic Modular Watering System',
    tagline: 'Best Hardware Award',
    event: 'JamHacks 8',
    award: 'Best Hardware Award',
    date: '2025',
    description:
      'A modular plant-watering system we built over a weekend that won the Best Hardware Award at JamHacks 8. Sensors and microcontrollers handle the watering for you, and you can configure it however your plants need.',
    tech: ['Arduino', 'Sensors', 'Hardware', 'C++'],
    image: null,
    devpost: null,
    github: null,
    team: [],
  },
  {
    id: 'xrsze',
    name: 'XRSZE',
    tagline: 'Computer-Vision Fitness Coach',
    event: 'Hack the North 2024',
    award: null,
    date: 'Sep 2024',
    description:
      'Counts reps across exercises with a calibrated MediaPipe vision model, paired with a Groq-powered AI coach that generates personalized meal plans, workout routines, and motivation from your height, weight, age, and dietary restrictions.',
    tech: ['MediaPipe', 'Groq', 'Node.js', 'JavaScript', 'HTML', 'CSS'],
    image:
      'https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/023/639/datas/original.png',
    devpost: 'https://devpost.com/software/xrsze',
    github: 'https://github.com/Zwc-11/XRSZE-Hack-the-North-2024-Public',
    team: ['Caesar Zhou', 'Leon Y', 'Gurvir Randhawa'],
  },
];
