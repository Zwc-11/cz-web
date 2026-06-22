import { AnimatePresence, motion } from 'framer-motion';
import { useLayout } from '../context/LayoutContext';
import TapestryLayout from './TapestryLayout';

export default function LayoutRouter({ profile, projects }) {
  const { layout } = useLayout();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={layout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <TapestryLayout profile={profile} projects={projects} />
      </motion.div>
    </AnimatePresence>
  );
}
