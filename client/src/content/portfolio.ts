import archive from './archive.json'
import { projects as recent, takeone } from './work'
import { deployments } from './deployments'

export type Work = {
  id: string; name: string; category: 'AI & agents' | 'Markets & data' | 'Robotics'; year: string;
  tagline: string; summary: string; problem: string; approach: string; result: string;
  tags: readonly string[]; links: { label: string; href: string }[];
  image?: string; caption?: string; award?: string;
}

export const experience = [...deployments, {
  id: 'brandeq', org: 'BrandEQ Group', mark: 'B', markBg: '#624d74', markFg: '#fff',
  role: 'Website Developer', period: 'Apr – Aug 2023', place: 'Toronto · Hybrid',
  employmentType: 'Internship',
  embeddedWith: ['Clients', 'Student development team'],
  problem: 'Community organisations needed websites that reflected their work and served their audiences.',
  shipped: 'Led a team of high-school students through client meetings, design and development. Delivered websites for the Lifelong Leadership Institute, BossWomen and the BBPA.',
  result: 'Recognized by CEO Nadine Spencer for creative direction and client results.',
  stack: ['Web development', 'Client discovery', 'Team leadership'],
}].map(e => e.id === 'csaa' ? {...e, period: '2025', shipped: 'Coached FRC and VEX students in CAD, robot bring-up and C++ PID control. Built a React, Electron and Python firmware/SDK generator to reduce repeated STM32 and Arduino setup.', stack: ['React', 'Electron', 'Python', 'C++', 'PID', 'CAD', 'STM32', 'Arduino'] } : e)

const category = (id: string): Work['category'] => ['hindsight', 'marketimmune', 'chaoswing', 'quant-portfolio'].includes(id) ? 'Markets & data' : 'AI & agents'

export const works: Work[] = [
  {
    id: 'takeone', name: 'TakeOne', category: 'Robotics', year: '2026',
    tagline: 'An AI film crew on wheels.',
    summary: 'Describe a scene. Rehearse the shot in 3D. Film it with a mobile rig carrying independent camera and lighting arms.',
    problem: 'We could imagine the shot, but a small team still had to coordinate the camera, lighting and performance. We wanted creative direction to lead to a real, rehearsable camera move.',
    approach: 'Connected an AI Director to structured shot plans, Python validation and a Three.js rehearsal. A reinforced RC cart carries two SO-101 arms, with an ESP32 coordinating the drive system over CAN bus. Physical filming stays under operator supervision.',
    result: 'Built with Ryan Qin and Basil Liu at Hack the North 2026. The submission connects direction, simulation, supervised filming and a React / FFmpeg editor in one workflow.',
    tags: ['Python', 'Three.js', 'MuJoCo', 'ESP32', 'CAN bus', 'OpenCV', 'MediaPipe', 'React', 'FFmpeg'],
    links: [{label:'Watch the demo', href:takeone.links.demo}, {label:'Source code',href:takeone.links.github}, {label:'Devpost',href:takeone.links.devpost}],
    image:'takeone/rig-front.jpg', caption:'The TakeOne camera and lighting rig, built at Hack the North.', award:'Hack the North 2026 · Finalist',
  },
  ...archive.projects.map(p => {
    const newer = recent.find(r => r.id === p.id)
    // Keep the September descriptions for projects that evolved after the old site.
    const evolved = p.id === 'hindsight' || p.id === 'murmur' || p.id === 'marketimmune'
    return {
      id:p.id, name:p.name, category:category(p.id), year:p.year,
      tagline:newer?.tagline ?? p.subtitle,
      summary:newer?.summary ?? p.description,
      problem:p.id === 'murmur' ? 'A plausible answer from a financial-document agent is not enough. The evidence, cost and decision path need to be inspectable and repeatable.' : p.challenge,
      approach:evolved && newer ? newer.points[0] : p.approach,
      result:evolved && newer ? newer.points[1] ?? newer.summary : p.outcome,
      tags:newer?.tags ?? p.tech,
      links:[{label:'Source code',href:p.link}, ...(p.liveUrl ? [{label:'Live project',href:p.liveUrl}] : [])],
      // Screenshots of earlier versions are explicitly dated, never represented as current runs.
      image:p.screenshots[0]?.src.replace(/^\//,''),
      caption:p.screenshots[0] ? `Project archive · ${p.repoMeta.updated}. ${p.screenshots[0].caption}` : undefined,
      award:p.id === 'quant-portfolio' ? '1st place · Waterloo CS & Finance' : undefined,
    }
  }),
  ...archive.hackathons.map(p => ({
    id:p.id, name:p.name, category:'Robotics' as const, year:p.id === 'jamhacks8' || p.date.includes('2024') ? '2024' : '2025',
    tagline:p.tagline, summary:p.description,
    problem:p.id === 'autodump' ? 'Can a robot find a full bin, reach it and empty itself without being driven through every step?' : p.id === 'jamhacks8' ? 'Plant care needs to adapt to different plants and configurations.' : p.id === 'baymax-bot' ? 'Explore how a physical companion could make voice interaction and health information more approachable.' : 'Make exercise feedback available through an ordinary camera.',
    approach:p.description,
    result:`Built at ${p.event}.${p.award ? ` Received ${p.award}.` : ' A hackathon prototype.'}`,
    tags:p.id === 'jamhacks8' ? ['Arduino', 'C++', 'Microcontrollers', 'Sensor integration'] : p.tech,
    links:[...(p.devpost ? [{label:'Devpost',href:p.devpost}] : []), ...(p.github ? [{label:'Source code',href:p.github}] : []), ...('dorahacks' in p && p.dorahacks ? [{label:'Project story',href:p.dorahacks}] : []), ...(p.id === 'jamhacks8' ? [{label:'Watch the demo',href:'https://www.youtube.com/watch?v=nycreUS2ojM'}] : [])],
    award:p.award ?? undefined,
  })),
]

export const recognition = archive.awards
