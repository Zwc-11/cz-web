import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Send } from 'lucide-react';
import { postContact } from '../../api/client';
import GridSection from '../art/GridSection';

export default function ContactSection({ contact, variant = 'split', index = '05' }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      await postContact(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <GridSection
      id="contact"
      index={index}
      title="Contact"
      subtitle="Want to build something reliable, useful, and a little impossible?"
      className="pb-8 sm:pb-12"
      variant={variant}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="ui-panel p-6 sm:p-8"
      >
        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${contact.email}`} className="btn-primary">
            <Mail size={16} className="mr-2" />
            Email Caesar
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <Github size={16} />
            GitHub
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 border-t border-white/[0.06] pt-8">
          <div className="module-grid sm:grid-cols-2">
            <label className="ui-panel border-0 bg-transparent p-0">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-white/40">
                Name
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-white/10 bg-base px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--accent)]"
              />
            </label>
            <label className="ui-panel border-0 bg-transparent p-0">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-white/40">
                Email
              </span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-white/10 bg-base px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--accent)]"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-white/40">
              Message
            </span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full resize-none border border-white/10 bg-base px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--accent)]"
            />
          </label>

          <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-50">
            <Send size={16} className="mr-2" />
            {status === 'loading' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'success' && (
            <p className="text-sm text-emerald-400">Message sent. Thanks for reaching out.</p>
          )}
          {status === 'error' && <p className="text-sm text-red-400">{error}</p>}
        </form>
      </motion.div>
    </GridSection>
  );
}
