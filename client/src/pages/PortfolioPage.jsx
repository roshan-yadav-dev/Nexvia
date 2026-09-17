import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Github,
  Save,
  Check,
  AlertCircle,
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

export default function PortfolioPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Project Editor Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    technologies: '',
    year: new Date().getFullYear().toString(),
    url: '',
    githubUrl: '',
    caseStudy: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bio/me');
      const p = res.data.profile;
      if (p) {
        setProfile(p);
        setProjects(p.projects || []);
      }
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewModal = () => {
    setEditingIndex(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      technologies: '',
      year: new Date().getFullYear().toString(),
      url: '',
      githubUrl: '',
      caseStudy: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (index) => {
    const proj = projects[index];
    setEditingIndex(index);
    setFormData({
      title: proj.title || '',
      description: proj.description || '',
      imageUrl: proj.imageUrl || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || ''),
      year: proj.year || new Date().getFullYear().toString(),
      url: proj.url || '',
      githubUrl: proj.githubUrl || '',
      caseStudy: proj.caseStudy || ''
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const techArray = formData.technologies
      ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const projectData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      technologies: techArray,
      year: formData.year.trim(),
      url: formData.url.trim(),
      githubUrl: formData.githubUrl.trim(),
      caseStudy: formData.caseStudy.trim(),
      order: editingIndex !== null ? projects[editingIndex].order : projects.length
    };

    let updatedProjects;
    if (editingIndex !== null) {
      updatedProjects = [...projects];
      updatedProjects[editingIndex] = projectData;
    } else {
      updatedProjects = [...projects, projectData];
    }

    setProjects(updatedProjects);
    setIsModalOpen(false);
  };

  const handleDeleteProject = (index) => {
    if (!window.confirm('Delete this project from your portfolio?')) return;
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleMoveProject = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const copy = [...projects];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    // update order properties
    copy.forEach((item, idx) => {
      item.order = idx;
    });
    setProjects(copy);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      await api.post('/bio', {
        displayName: profile?.displayName || user?.username,
        headline: profile?.headline || '',
        bio: profile?.bio || '',
        avatarUrl: profile?.avatarUrl || '',
        theme: profile?.theme || 'dark-slate',
        socialLinks: profile?.socialLinks || [],
        experience: profile?.experience || [],
        projects: projects
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save portfolio');
    } finally {
      setSaving(false);
    }
  };

  const publicUrl = `${window.location.origin}/bio/${user?.username}`;

  return (
    <div className="min-h-screen bg-nexvia-cream p-3 sm:p-6 lg:p-8 font-sans antialiased text-nexvia-charcoal selection:bg-nexvia-amber selection:text-nexvia-charcoal">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="bg-nexvia-charcoal rounded-4xl sm:rounded-5xl p-6 sm:p-10 text-nexvia-ivory shadow-2xl border border-nexvia-charcoal-border space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-nexvia-charcoal-border/70">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-nexvia-ivory">
                  Selected Work <span className="text-nexvia-amber">Studio</span>
                </h1>
                <Badge variant="amber" size="sm">
                  {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                </Badge>
              </div>
              <p className="text-[#A5A298] text-xs sm:text-sm mt-1">
                Curate your portfolio showcase, featured case studies, and code deliverables.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5"
                onClick={handleOpenNewModal}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Project
              </Button>
              <a href={publicUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> Live Profile
                </Button>
              </a>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveAll}
                isLoading={saving}
              >
                <Save className="w-4 h-4 mr-1" /> Save Portfolio
              </Button>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                Selected Work saved and published to your live digital presence!
              </span>
              <a href={publicUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">
                View on Public Bio →
              </a>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Editorial Selected Work Grid (Numbered 01, 02... matching reference design) */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-nexvia-amber border-t-transparent mx-auto mb-3" />
              <p className="text-[#A5A298] text-xs sm:text-sm">Loading portfolio...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-16 text-center bg-nexvia-charcoal-card rounded-3xl border border-nexvia-charcoal-border/70 p-8">
              <div className="w-14 h-14 bg-nexvia-charcoal rounded-full flex items-center justify-center mx-auto mb-3 text-nexvia-amber">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-nexvia-ivory">No projects added yet</h3>
              <p className="text-[#A5A298] text-xs max-w-sm mx-auto mb-5">
                Add your first project to display in the numbered Selected Work section of your Nexvia web presence.
              </p>
              <Button variant="primary" size="sm" onClick={handleOpenNewModal}>
                <Plus className="w-4 h-4 mr-1" /> Add First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, idx) => {
                const formattedNum = String(idx + 1).padStart(2, '0');
                const techList = Array.isArray(proj.technologies) ? proj.technologies : [];

                return (
                  <div
                    key={idx}
                    className="bg-nexvia-charcoal-card rounded-3xl border border-nexvia-charcoal-border/70 p-6 flex flex-col justify-between hover:border-nexvia-amber/40 transition-all group"
                  >
                    <div>
                      {/* Top bar: Number & Actions */}
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-nexvia-charcoal-border/60">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-nexvia-amber">
                            {formattedNum}
                          </span>
                          <span className="text-xs text-[#77756D] uppercase tracking-wider font-semibold">
                            {proj.year || '2026'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveProject(idx, -1)}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg text-[#77756D] hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveProject(idx, 1)}
                            disabled={idx === projects.length - 1}
                            className="p-1.5 rounded-lg text-[#77756D] hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(idx)}
                            className="p-1.5 rounded-lg text-[#A5A298] hover:text-nexvia-amber transition-colors ml-1"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(idx)}
                            className="p-1.5 rounded-lg text-[#A5A298] hover:text-red-400 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Optional Image */}
                      {proj.imageUrl && (
                        <div className="mb-4 rounded-2xl overflow-hidden aspect-video bg-nexvia-charcoal border border-nexvia-charcoal-border">
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold text-nexvia-ivory mb-1.5">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-[#A5A298] leading-relaxed mb-4 line-clamp-3">
                        {proj.description || 'No description provided.'}
                      </p>

                      {/* Tech tags */}
                      {techList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {techList.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded-full bg-white/5 border border-nexvia-charcoal-border/70 text-[10px] text-[#DDD7C8] font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* External links footer */}
                    <div className="pt-4 border-t border-nexvia-charcoal-border/50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {proj.url && (
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-nexvia-amber hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Live Project</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#A5A298] hover:text-white flex items-center gap-1"
                          >
                            <Github className="w-3 h-3" />
                            <span>Code</span>
                          </a>
                        )}
                      </div>

                      {proj.caseStudy && (
                        <span className="text-[11px] text-[#77756D]">
                          Has Case Study
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndex !== null ? `Edit Project · ${String(editingIndex + 1).padStart(2, '0')}` : 'Add Selected Work Project'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleModalSubmit} className="space-y-4">
          <Input
            label="Project Title *"
            placeholder="e.g. Design System Architecture"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Year"
              placeholder="2026"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
            <Input
              label="Technologies (Comma separated)"
              placeholder="React, Tailwind, Node.js"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of the architecture, deliverables, and impact..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-nexvia-charcoal text-nexvia-ivory border border-nexvia-charcoal-border rounded-2xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80 placeholder:text-[#65635C]"
            />
          </div>

          <Input
            label="Image / Cover URL"
            placeholder="https://images.unsplash.com/..."
            icon={ImageIcon}
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Live URL"
              placeholder="https://myproject.com"
              icon={ExternalLink}
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            <Input
              label="GitHub Repository"
              placeholder="https://github.com/..."
              icon={Github}
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Case Study Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Key metrics, design rationale, or client testimonial..."
              value={formData.caseStudy}
              onChange={(e) => setFormData({ ...formData, caseStudy: e.target.value })}
              className="w-full bg-nexvia-charcoal text-nexvia-ivory border border-nexvia-charcoal-border rounded-2xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80 placeholder:text-[#65635C]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingIndex !== null ? 'Update Project' : 'Add to Showcase'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
