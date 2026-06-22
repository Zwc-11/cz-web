export default function Footer({ contact }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="section-shell flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">Caesar Zhou</p>
          <p className="mt-2 text-sm text-white/50">Systems · agents · evaluation discipline</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="chip hover:border-[var(--accent)] hover:text-[var(--accent)]">
            GitHub
          </a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="chip hover:border-[var(--accent)] hover:text-[var(--accent)]">
            LinkedIn
          </a>
          {contact.devpost && (
            <a href={contact.devpost} target="_blank" rel="noopener noreferrer" className="chip hover:border-[var(--accent)] hover:text-[var(--accent)]">
              Devpost
            </a>
          )}
          <a href={`mailto:${contact.email}`} className="chip hover:border-[var(--accent)] hover:text-[var(--accent)]">
            Email
          </a>
        </div>
        <p className="font-mono text-[10px] text-white/25">© {year}</p>
      </div>
    </footer>
  );
}
