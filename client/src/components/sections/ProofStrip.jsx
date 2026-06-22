import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  GitBranch,
  GraduationCap,
  Shield,
} from 'lucide-react';
import GridSection from '../art/GridSection';

const ICONS = {
  'graduation-cap': GraduationCap,
  shield: Shield,
  'git-branch': GitBranch,
  activity: Activity,
  cpu: Cpu,
};

export default function ProofStrip({ items, variant = 'split', index = '01' }) {
  return (
    <GridSection
      id="proof"
      index={index}
      title="Proof"
      subtitle="Systems that survived real workflows"
      variant={variant}
    >
      <div className="module-grid sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = ICONS[item.icon] || Activity;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="ui-panel ui-panel-hover group relative p-5"
            >
              <div className="absolute left-0 top-0 h-0.5 w-8 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
              <div className="flex items-start justify-between">
                <Icon size={16} className="text-[var(--accent)]" strokeWidth={1.5} />
                <span className="font-mono text-[10px] text-white/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-4 text-sm leading-snug text-white/70">{item.label}</p>
            </motion.div>
          );
        })}
      </div>
    </GridSection>
  );
}
