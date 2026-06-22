import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function GridSection({
  id,
  index,
  title,
  subtitle,
  children,
  className = '',
  aside,
  variant = 'editorial',
}) {
  const isEditorial = variant === 'editorial' || variant === 'split';
  const reduced = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id={id} ref={ref} className={`editorial-section ${className}`}>
      <div className="section-shell editorial-section-inner">
        <div className={isEditorial ? 'editorial-section-grid' : 'grid gap-8'}>
          <motion.header
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={reduced ? undefined : { y }}
            className="editorial-section-head"
          >
            <span className="editorial-index">{index}</span>
            <p className="section-label">{title}</p>
            {subtitle && <h2 className="section-title">{subtitle}</h2>}
            {aside && <div className="editorial-aside">{aside}</div>}
          </motion.header>

          <div className="editorial-section-body">{children}</div>
        </div>
      </div>
    </section>
  );
}
