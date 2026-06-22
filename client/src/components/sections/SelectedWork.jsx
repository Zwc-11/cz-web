import { motion } from 'framer-motion';
import ProjectCard from '../cards/ProjectCard';
import GridSection from '../art/GridSection';

export default function SelectedWork({ projects, variant = 'editorial' }) {
  return (
    <GridSection
      id="work"
      index="02"
      title="Work"
      subtitle="Selected systems"
      variant={variant}
      aside={
        <p className="text-sm leading-relaxed text-white/45">
          Agent harness, toxic-flow detection, leakage-safe reranking — three builds with distinct failure modes and
          evaluation discipline.
        </p>
      }
    >
      <div className="work-bento">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            variant={i === 0 ? 'featured' : 'module'}
            className={i === 0 ? 'work-bento-feature' : i === 2 ? 'work-bento-wide' : ''}
          />
        ))}
      </div>
    </GridSection>
  );
}
