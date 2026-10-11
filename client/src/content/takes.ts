// Full-screen stories retained from v2, available from the tabbed portfolio
// and the original deep links.

export type TakeId = 'ecobee' | 'before' | 'takeone' | 'projects'

export type Take = {
  id: TakeId
  n: string
  label: string // shown in the take header and nav
  preview: { title: string; line: string; thumb: 'ecobee' | 'before' | 'rig' | 'hindsight' }
}

export const takes: Take[] = [
  {
    id: 'ecobee',
    n: '01',
    label: 'ecobee',
    preview: { title: 'ecobee · FDE internship', line: 'Building AI tools for finance, accounting and sales teams', thumb: 'ecobee' },
  },
  {
    id: 'before',
    n: '02',
    label: 'Before ecobee',
    preview: { title: 'WDI · Gore Mutual · CSAA · BrandEQ', line: 'Internships, part-time contract work, and how I got here', thumb: 'before' },
  },
  {
    id: 'takeone',
    n: '03',
    label: 'TakeOne',
    preview: { title: 'TakeOne · Hack the North 2026 Finalist', line: 'An AI director that plans, rehearses and films, plus more applied AI builds', thumb: 'rig' },
  },
  {
    id: 'projects',
    n: '04',
    label: 'Projects',
    preview: { title: 'Six builds for agents, evaluation and data', line: 'Hindsight, Murmur, MarketImmune, AgentReplay, ChaosWing and Quant Portfolio', thumb: 'hindsight' },
  },
]

export const takeIds = takes.map((t) => t.id)
export const isTakeId = (s: string): s is TakeId => (takeIds as string[]).includes(s)
