import React, { useState } from 'react';
import { Link2, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

export default function CreateLinkModal({ isOpen, onClose, onLinkCreated }) {
  const [destinationUrl, setDestinationUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/links', {
        destinationUrl,
        customAlias: customAlias.trim() || undefined,
        title: title.trim() || undefined
      });

      setDestinationUrl('');
      setCustomAlias('');
      setTitle('');
      onLinkCreated(res.data.link);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to generate short link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Branded Short Link" maxWidth="max-w-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 rounded-2xl text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Destination URL"
          placeholder="https://example.com/long-page-url"
          icon={Link2}
          value={destinationUrl}
          onChange={(e) => setDestinationUrl(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Custom Vanity Alias (Optional)"
            placeholder="e.g. launch-offer"
            helperText="6-char nanoid if blank"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
          />

          <Input
            label="Internal Title (Optional)"
            placeholder="e.g. Summer Campaign"
            helperText="Visible in your library"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            Generate Link <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
