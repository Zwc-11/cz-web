// Links and facts shown on the page. Edit here; components read from this file.

export const LINKS = {
  github: 'https://github.com/Zwc-11',
  source: 'https://github.com/3-rt/TakeOne',
  devpost: 'https://devpost.com/software/takeone-erqv3l',
  site: 'https://caesarzhou.com',
}

export const TEAM = 'Caesar Zhou, Ryan Qin and Basil Liu'
export const AWARD = 'Top-scoring finalist, Hack the North 2026'
export const STACK = ['Python', 'Three.js', 'MuJoCo', 'ESP32', 'CAN bus', 'OpenCV', 'MediaPipe', 'React', 'FFmpeg']

export const TALK_LINES: { who: 'You' | 'TakeOne'; text: string }[] = [
  { who: 'You', text: 'Give me a five-second push-in.' },
  { who: 'TakeOne', text: 'Setting that up now.' },
  { who: 'TakeOne', text: 'Five seconds, pushing in from 1.4 metres. Ready when you are.' },
  { who: 'You', text: 'Can I come in from the left instead?' },
  { who: 'TakeOne', text: 'Sure. I’ll move your mark and re-plan the shot.' },
]

export const STEPS = [
  { title: 'Plan', body: 'The director turns the script into structured shots, chosen from a library of 39 shot types.' },
  { title: 'Compile', body: 'Each shot becomes a timed path for the cart and both arms, repositions between shots included.' },
  { title: 'Preflight', body: 'Moves are checked against the arms’ calibrated limits. A refusal names the field that failed, so the director can say why.' },
  { title: 'Rehearse', body: 'The whole sequence plays on one clock in the 3D simulator before the robot commits to a take.' },
]

export const LABELS = [
  'iPhone on arm one',
  'Ring light on arm two',
  'SO-ARM101, five joints',
  'Two-post tower',
  'Laptop runs the director',
  'Electronics bay',
  'Drive wheels',
]
