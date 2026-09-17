import React, { useState, useEffect } from 'react';
import {
  Link2,
  Search,
  Plus,
  Copy,
  Check,
  QrCode,
  BarChart2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Power,
  Edit2
} from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import CreateLinkModal from '../components/CreateLinkModal';
import EditLinkModal from '../components/EditLinkModal';
import QRCodeModal from '../components/QRCodeModal';
import LinkAnalyticsModal from '../components/LinkAnalyticsModal';

export default function LinkLibrary() {
  const [links, setLinks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalCount: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedQRLink, setSelectedQRLink] = useState(null);
  const [selectedAnalyticsLink, setSelectedAnalyticsLink] = useState(null);
  const [selectedEditLink, setSelectedEditLink] = useState(null);

  // Clipboard copy state
  const [copiedId, setCopiedId] = useState(null);

  const fetchLinks = async (page = 1, searchQuery = search) => {
    setLoading(true);
    try {
      const res = await api.get('/links', {
        params: {
          page,
          limit: 10,
          search: searchQuery.trim() || undefined
        }
      });
      setLinks(res.data.links);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks(1, search);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLinks(1, search);
  };

  const handleCopy = async (link) => {
    const url = `${window.location.origin}/r/${link.shortCode}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(link._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleToggle = async (link) => {
    try {
      const res = await api.patch(`/links/${link._id}/toggle`);
      setLinks(links.map(l => l._id === link._id ? { ...l, isActive: res.data.link.isActive } : l));
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const handleDelete = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this short link and its click history?')) return;
    try {
      await api.delete(`/links/${linkId}`);
      setLinks(links.filter(l => l._id !== linkId));
      setPagination(prev => ({ ...prev, totalCount: Math.max(0, prev.totalCount - 1) }));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleLinkUpdated = (updatedLink) => {
    setLinks(links.map(l => l._id === updatedLink._id ? updatedLink : l));
  };

  return (
    <div className="min-h-screen bg-nexvia-cream p-3 sm:p-6 lg:p-8 font-sans antialiased text-nexvia-charcoal selection:bg-nexvia-amber selection:text-nexvia-charcoal">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="bg-nexvia-charcoal rounded-4xl sm:rounded-5xl p-6 sm:p-10 text-nexvia-ivory shadow-2xl border border-nexvia-charcoal-border">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-nexvia-charcoal-border/70">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-nexvia-ivory">
                  Links <span className="text-nexvia-amber">Studio</span>
                </h1>
                <Badge variant="amber" size="sm">
                  {pagination.totalCount} Links
                </Badge>
              </div>
              <p className="text-[#A5A298] text-xs sm:text-sm mt-1">
                Manage, edit, analyze, and distribute your branded vanity links.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateOpen(true)}
              className="self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 mr-1" /> Create Short Link
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 mb-6">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77756D]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search by slug, title, or destination URL..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-nexvia-charcoal-card text-nexvia-ivory border border-nexvia-charcoal-border rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80 placeholder:text-[#65635C]"
              />
            </form>
            <Button
              variant="outline"
              size="md"
              className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5"
              onClick={() => fetchLinks(1, search)}
            >
              Filter
            </Button>
          </div>

          {/* Table / List of Links */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-nexvia-amber border-t-transparent mx-auto mb-3" />
              <p className="text-[#A5A298] text-xs sm:text-sm">Loading your link library...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="py-16 text-center bg-nexvia-charcoal-card rounded-3xl border border-nexvia-charcoal-border/70 p-8">
              <div className="w-14 h-14 bg-nexvia-charcoal rounded-full flex items-center justify-center mx-auto mb-3 text-nexvia-amber">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-nexvia-ivory">No short links found</h3>
              <p className="text-[#A5A298] text-xs max-w-sm mx-auto mb-5">
                {search ? 'No results matched your search query. Try clearing the filter.' : 'Create your first branded short link to start tracking real-time click analytics.'}
              </p>
              <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Create Short Link
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link) => {
                const isCopied = copiedId === link._id;

                return (
                  <div
                    key={link._id}
                    className={`bg-nexvia-charcoal-card hover:bg-white/[0.04] transition-all p-4 sm:p-5 rounded-3xl border ${
                      link.isActive ? 'border-nexvia-charcoal-border/70' : 'border-red-500/20 opacity-60'
                    } flex flex-col lg:flex-row lg:items-center justify-between gap-4`}
                  >
                    {/* Link Info */}
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-base text-nexvia-ivory tracking-tight">
                          /{link.shortCode}
                        </span>
                        {link.isCustomAlias && (
                          <span className="px-2 py-0.5 rounded-full bg-sky-950/60 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
                            Vanity
                          </span>
                        )}
                        {!link.isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-500/30 text-[10px] font-bold">
                            Inactive
                          </span>
                        )}
                        {link.title && (
                          <span className="text-xs font-medium text-[#A5A298] bg-black/20 px-2.5 py-0.5 rounded-full border border-white/5">
                            {link.title}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#A5A298]">
                        <span className="truncate max-w-[280px] sm:max-w-md font-mono" title={link.destinationUrl}>
                          {link.destinationUrl}
                        </span>
                        <a
                          href={link.destinationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-nexvia-ivory transition-colors"
                          title="Visit destination directly"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 self-end lg:self-auto">
                      {/* Clicks Pill */}
                      <button
                        onClick={() => setSelectedAnalyticsLink(link)}
                        className="px-3 py-1.5 rounded-full bg-nexvia-charcoal hover:bg-white/5 text-xs font-semibold text-nexvia-ivory border border-nexvia-charcoal-border flex items-center gap-1.5 transition-colors"
                        title="View detailed link analytics"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-nexvia-amber" />
                        <span>{link.totalClicks || 0} clicks</span>
                      </button>

                      {/* Copy Short Link */}
                      <button
                        onClick={() => handleCopy(link)}
                        className={`p-2 rounded-full border transition-all ${
                          isCopied
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                            : 'bg-nexvia-charcoal hover:bg-white/10 text-[#A5A298] hover:text-white border-nexvia-charcoal-border'
                        }`}
                        title="Copy short link URL to clipboard"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* QR Code */}
                      <button
                        onClick={() => setSelectedQRLink(link)}
                        className="p-2 rounded-full bg-nexvia-charcoal hover:bg-white/10 text-[#A5A298] hover:text-white border border-nexvia-charcoal-border transition-colors"
                        title="Show and download QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Link Destination / Title */}
                      <button
                        onClick={() => setSelectedEditLink(link)}
                        className="p-2 rounded-full bg-nexvia-charcoal hover:bg-white/10 text-[#A5A298] hover:text-white border border-nexvia-charcoal-border transition-colors"
                        title="Edit link destination or title"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Active */}
                      <button
                        onClick={() => handleToggle(link)}
                        className={`p-2 rounded-full border transition-colors ${
                          link.isActive
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/40'
                            : 'bg-gray-900 text-gray-500 border-gray-700 hover:text-gray-300'
                        }`}
                        title={link.isActive ? 'Deactivate link' : 'Activate link'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(link._id)}
                        className="p-2 rounded-full bg-nexvia-charcoal hover:bg-red-950/50 text-[#A5A298] hover:text-red-400 border border-nexvia-charcoal-border transition-colors"
                        title="Delete link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-nexvia-charcoal-border/70 text-xs text-[#A5A298]">
              <span>
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} links)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchLinks(pagination.page - 1, search)}
                  className="border-nexvia-charcoal-border text-nexvia-ivory disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-0.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchLinks(pagination.page + 1, search)}
                  className="border-nexvia-charcoal-border text-nexvia-ivory disabled:opacity-30"
                >
                  Next <ChevronRight className="w-4 h-4 ml-0.5" />
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Create Link Modal */}
      <CreateLinkModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onLinkCreated={(newLink) => {
          setLinks([newLink, ...links]);
          setPagination(prev => ({ ...prev, totalCount: prev.totalCount + 1 }));
        }}
      />

      {/* Edit Link Modal */}
      <EditLinkModal
        isOpen={!!selectedEditLink}
        onClose={() => setSelectedEditLink(null)}
        link={selectedEditLink}
        onLinkUpdated={handleLinkUpdated}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={!!selectedQRLink}
        onClose={() => setSelectedQRLink(null)}
        link={selectedQRLink}
      />

      {/* Link Analytics Modal */}
      <LinkAnalyticsModal
        isOpen={!!selectedAnalyticsLink}
        onClose={() => setSelectedAnalyticsLink(null)}
        link={selectedAnalyticsLink}
      />
    </div>
  );
}
