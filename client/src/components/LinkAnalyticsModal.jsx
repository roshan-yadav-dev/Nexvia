import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Eye, Users, Calendar, Globe, Smartphone } from 'lucide-react';
import api from '../api/axios';
import Modal from './ui/Modal';
import Badge from './ui/Badge';

const DEVICE_COLORS = {
  Desktop: '#FFD54F',
  Mobile: '#A3E635',
  Tablet: '#C7D2FE',
  Other: '#9CA3AF'
};

export default function LinkAnalyticsModal({ isOpen, onClose, link }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && link?._id) {
      fetchAnalytics();
    }
  }, [isOpen, link]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/analytics/${link._id}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load link analytics.');
    } finally {
      setLoading(false);
    }
  };

  if (!link) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Analytics · /${link.shortCode}`} maxWidth="max-w-3xl">
      {loading && (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-yellow border-t-transparent mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Aggregating real-time click data...</p>
        </div>
      )}

      {!loading && error && (
        <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-2xl text-red-200 text-sm">
          {error}
        </div>
      )}

      {!loading && data && (
        <div className="space-y-6">
          {/* Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#1C1B1E] p-4 rounded-2xl border border-white/5">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Total Clicks
              </span>
              <span className="text-2xl font-extrabold text-[#FFD54F]">
                {data.metrics.totalClicks.toLocaleString()}
              </span>
            </div>

            <div className="bg-[#1C1B1E] p-4 rounded-2xl border border-white/5">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Unique Visitors
              </span>
              <span className="text-2xl font-extrabold text-white">
                {data.metrics.uniqueVisitors.toLocaleString()}
              </span>
            </div>

            <div className="bg-[#1C1B1E] p-4 rounded-2xl border border-white/5 col-span-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Target Destination
              </span>
              <span className="text-xs text-gray-200 truncate block font-mono">
                {link.destinationUrl}
              </span>
            </div>
          </div>

          {/* Clicks Over Time */}
          <div className="bg-[#1C1B1E] p-5 rounded-3xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-yellow" /> Clicks Over Time (Daily)
              </h4>
              <Badge variant="yellow" size="sm">Real-time</Badge>
            </div>
            {data.clicksOverTime.length > 0 ? (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.clicksOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFD54F" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FFD54F" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={11} tickLine={false} />
                    <YAxis stroke="#6B7280" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#222124', borderColor: '#3D3C42', borderRadius: '1rem', color: '#fff' }}
                      itemStyle={{ color: '#FFD54F' }}
                    />
                    <Area type="monotone" dataKey="clicks" stroke="#FFD54F" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 text-xs">
                No clicks recorded for this link yet. Click the short link to populate data!
              </div>
            )}
          </div>

          {/* Referrers & Devices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Top Referrers */}
            <div className="bg-[#1C1B1E] p-5 rounded-3xl border border-white/5">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" /> Top Referrers
              </h4>
              {data.topReferrers.length > 0 ? (
                <div className="space-y-2.5">
                  {data.topReferrers.map((ref, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-gray-300 truncate max-w-[180px]">{ref.referrer}</span>
                      <span className="font-bold text-brand-yellow px-2 py-0.5 rounded-full bg-brand-charcoal border border-brand-charcoal-border">
                        {ref.count} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-xs py-4">No referrers detected.</p>
              )}
            </div>

            {/* Device Distribution */}
            <div className="bg-[#1C1B1E] p-5 rounded-3xl border border-white/5">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-green-400" /> Device Distribution
              </h4>
              {data.deviceDistribution.length > 0 ? (
                <div className="space-y-2.5">
                  {data.deviceDistribution.map((dev, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: DEVICE_COLORS[dev.device] || '#9CA3AF' }}
                        />
                        <span className="text-gray-300">{dev.device}</span>
                      </div>
                      <span className="font-bold text-white px-2 py-0.5 rounded-full bg-brand-charcoal border border-brand-charcoal-border">
                        {dev.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-xs py-4">No device data detected.</p>
              )}
            </div>

          </div>

        </div>
      )}
    </Modal>
  );
}
