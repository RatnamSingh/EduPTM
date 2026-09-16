import { useState, useEffect } from 'react';
import apiClient, { loginMockERP } from '../api/client';

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('ANALYTICS');
  const [formData, setFormData] = useState({
    title: '', date: '', start_time: '', end_time: '',
    slot_duration_minutes: 15, gap_duration_minutes: 5, mode: 'VIRTUAL'
  });
  const [creating, setCreating] = useState(false);

  // Fetch stats function to call after creating event
  const fetchStats = () => {
    apiClient.get('/analytics')
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to load analytics", err));
  };

  useEffect(() => {
    fetchStats();
    setLoading(false);
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiClient.post('/events', formData);
      alert('Event created and slots generated successfully!');
      setFormData({ title: '', date: '', start_time: '', end_time: '', slot_duration_minutes: 15, gap_duration_minutes: 5, mode: 'VIRTUAL' });
      setActiveTab('ANALYTICS');
      fetchStats();
    } catch (err) {
      console.error(err);
      alert('Failed to create event');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">PTM Administration</h1>
            <p className="text-slate-500 mt-2">Manage events and track real-time school metrics.</p>
          </div>
          <div className="flex space-x-2 bg-slate-200 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('ANALYTICS')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ANALYTICS' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Analytics Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('CREATE_EVENT')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'CREATE_EVENT' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Create Event
            </button>
          </div>
        </header>

        {activeTab === 'ANALYTICS' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Events" value={stats?.total_events || 0} color="blue" />
            <StatCard title="Total Slots Created" value={stats?.total_slots || 0} color="indigo" />
            <StatCard title="Slots Booked" value={stats?.booked_slots || 0} color="green" />
            <StatCard title="Utilization Rate" value={`${stats?.utilization_percentage || 0}%`} color="purple" />
          </div>
        )}

        {activeTab === 'CREATE_EVENT' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Event Configurator</h2>
            <form onSubmit={handleCreateEvent} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Mid-Term Academic Review 2026" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Mode</label>
                  <select value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="IN_PERSON">In Person</option>
                    <option value="VIRTUAL">Virtual</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input required type="time" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input required type="time" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slot Duration (mins)</label>
                  <input required type="number" min="5" value={formData.slot_duration_minutes} onChange={e => setFormData({...formData, slot_duration_minutes: parseInt(e.target.value)})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gap Between Slots (mins)</label>
                  <input required type="number" min="0" value={formData.gap_duration_minutes} onChange={e => setFormData({...formData, gap_duration_minutes: parseInt(e.target.value)})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>

              <button disabled={creating} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {creating ? 'Generating Event & Slots...' : 'Create PTM Event'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className={`text-3xl font-bold ${colors[color].split(' ')[1]}`}>{value}</p>
      </div>
    </div>
  );
}
