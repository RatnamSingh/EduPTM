import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import VideoMeeting from './VideoMeeting';

export default function TeacherPortal() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState({});
  const [activeMeetingLink, setActiveMeetingLink] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get('/teacher/schedule')
      .then(res => setSchedule(res.data))
      .catch(err => console.error("Failed to load schedule", err))
      .finally(() => setLoading(false));
  }, []);

  const handleEditChange = (bookingId, field, value) => {
    setEdits(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [field]: value
      }
    }));
  };

  const handleUpdateBooking = async (bookingId) => {
    let updateData = { ...edits[bookingId] };
    if (!updateData || Object.keys(updateData).length === 0) return;

    // Auto-complete status if a remark is added and status wasn't explicitly changed
    if (updateData.teacher_remarks && updateData.teacher_remarks.trim() !== '' && !updateData.status) {
      updateData.status = 'COMPLETED';
    }

    setSaving(prev => ({ ...prev, [bookingId]: true }));
    try {
      const res = await apiClient.patch(`/bookings/${bookingId}`, updateData);
      // Update local schedule
      setSchedule(prevSchedule => 
        prevSchedule.map(slot => 
          slot.booking_id === bookingId 
            ? { ...slot, status: res.data.status, teacher_remarks: updateData.teacher_remarks !== undefined ? updateData.teacher_remarks : slot.teacher_remarks } 
            : slot
        )
      );
      // Clear edits for this booking
      setEdits(prev => {
        const newEdits = { ...prev };
        delete newEdits[bookingId];
        return newEdits;
      });
    } catch (err) {
      console.error('Failed to update booking', err);
      alert('Failed to update booking.');
    } finally {
      setSaving(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Schedule...</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-blue-100 text-blue-700';
      case 'NO_SHOW': return 'bg-red-100 text-red-700';
      case 'CANCELLED': return 'bg-slate-100 text-slate-700';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700';
      case 'BOOKED':
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <>
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Teacher Dashboard</h1>
          <p className="text-slate-500 mt-2">Here is your PTM schedule.</p>
        </header>

        <div className="space-y-4">
          {schedule.length === 0 && <p className="text-slate-500">No slots assigned to you.</p>}
          
          {schedule.map((slot) => (
            <div 
              key={slot.id} 
              className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row justify-between items-start md:items-center ${slot.is_booked ? 'border-indigo-200' : 'border-slate-200'}`}
            >
              <div className="flex-1 w-full md:w-auto">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-slate-800">
                    {slot.start_time} - {slot.end_time}
                  </span>
                  {slot.is_booked ? (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase tracking-wider ${getStatusColor(slot.status)}`}>
                      {slot.status ? slot.status.replace('_', ' ') : 'BOOKED'}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">Available</span>
                  )}
                </div>
                
                {slot.is_booked && (
                  <div className="mt-3 text-slate-600">
                    <p><strong>Student:</strong> {slot.student_id}</p>
                    {slot.parent_pre_query && (
                      <p className="mt-1 text-sm bg-slate-50 p-2 rounded-md border border-slate-100 italic">
                        "{slot.parent_pre_query}"
                      </p>
                    )}
                    
                    {/* Management Controls */}
                    <div className="mt-4 pt-4 border-t border-slate-100 pr-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                          <select 
                            className="text-sm border border-slate-300 rounded-md p-1.5 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                            value={edits[slot.booking_id]?.status || slot.status || 'BOOKED'}
                            onChange={(e) => handleEditChange(slot.booking_id, 'status', e.target.value)}
                          >
                            <option value="BOOKED">Booked</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="NO_SHOW">No Show</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Remarks for Parent</label>
                          <textarea 
                            className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                            rows="2"
                            placeholder="Share feedback with the parent..."
                            value={edits[slot.booking_id]?.teacher_remarks !== undefined ? edits[slot.booking_id].teacher_remarks : (slot.teacher_remarks || '')}
                            onChange={(e) => handleEditChange(slot.booking_id, 'teacher_remarks', e.target.value)}
                          />
                        </div>
                        
                        {(edits[slot.booking_id]?.status !== undefined || edits[slot.booking_id]?.teacher_remarks !== undefined) && (
                          <div>
                            <button 
                              onClick={() => handleUpdateBooking(slot.booking_id)}
                              disabled={saving[slot.booking_id]}
                              className="text-xs px-3 py-1.5 bg-indigo-100 text-indigo-700 font-medium rounded hover:bg-indigo-200 transition-colors"
                            >
                              {saving[slot.booking_id] ? 'Saving...' : 'Save Updates'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col justify-end space-y-2 ml-0 md:ml-4">
                {slot.is_booked && slot.meeting_link && (
                  <button 
                    onClick={() => setActiveMeetingLink(slot.meeting_link)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    Join Video Call
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {activeMeetingLink && (
      <VideoMeeting 
        meetingLink={activeMeetingLink} 
        onClose={() => setActiveMeetingLink(null)} 
      />
    )}
    </>
  );
}
