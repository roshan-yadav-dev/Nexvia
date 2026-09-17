import React, { useState, useEffect } from 'react';
import { Link2, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

export default function EditLinkModal({ isOpen, onClose, link, onLinkUpdated }) {
  const [destinationUrl, setDestinationUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (link) {
      setDestinationUrl(link.destinationUrl || '');
      setTitle(link.title || '');
      setError('');
    }
  }, [link, isOpen]);

  if (!link) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.patch(`/links/${link._id}`, {
        destinationUrl: destinationUrl.trim(),
        title: title.trim()
      });

      if (onLinkUpdated) {
        onLinkUpdated(res.data.link);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update short link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Link · /${link.shortCode}`} maxWidth="max-w-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 rounded-2xl text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Short Code / Alias
          </span>
          <div className="px-4 py-2.5 rounded-2xl bg-[#181814] border border-white/5 text-gray-400 font-mono text-sm">
            /{link.shortCode}
          </div>
        </div>

        <Input
          label="Target Destination URL"
          placeholder="https://example.com/target-page"
          icon={Link2}
          value={destinationUrl}
          onChange={(e) => setDestinationUrl(e.target.value)}
          required
        />

        <Input
          label="Internal Title / Notes"
          placeholder="e.g. Design Portfolio Launch"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          helperText="Display label inside your Nexvia links studio"
        />

        <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            Save Changes <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
