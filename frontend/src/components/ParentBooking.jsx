import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import VideoMeeting from './VideoMeeting';

export default function ParentBooking() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('FIND_SLOTS');
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [activeMeetingLink, setActiveMeetingLink] = useState(null);

  // Fetch real events once logged in
  useEffect(() => {
    apiClient.get('/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to fetch events", err));
  }, []);

  // Fetch my bookings if tab is active
  useEffect(() => {
    if (activeTab === 'MY_BOOKINGS' || activeTab === 'DASHBOARD') {
      setLoadingBookings(true);
      apiClient.get('/bookings')
        .then(res => setMyBookings(res.data))
        .catch(err => console.error("Failed to fetch my bookings", err))
        .finally(() => setLoadingBookings(false));
    }
  }, [activeTab]);

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setLoading(true);
    try {
      const res = await apiClient.get(`/events/${event.id}/slots`);
      setSlots(res.data);
    } catch (error) {
      console.error("Failed to fetch slots", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slotId) => {
    try {
      await apiClient.post('/bookings', {
        slot_id: slotId,
        parent_pre_query: "Just wanted to check on math progress."
      });
      // Refresh slots
      const res = await apiClient.get(`/events/${selectedEvent.id}/slots`);
      setSlots(res.data);
      alert("Booking successful!");
      // Optionally switch to my bookings tab
      setActiveTab('MY_BOOKINGS');
    } catch (error) {
      alert(error.response?.data?.message || "Failed to book slot");
    }
  };

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

  // Derived stats
  const completedCount = myBookings.filter(b => b.status === 'COMPLETED').length;
  const upcomingCount = myBookings.filter(b => b.status === 'BOOKED' || b.status === 'IN_PROGRESS').length;

  return (
    <>
    <div className="flex h-full bg-slate-50 min-h-[calc(100vh-73px)]">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col flex-shrink-0 pt-6">
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon="dashboard" label="Dashboard" active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} />
          <SidebarItem icon="calendar" label="Find Slots" active={activeTab === 'FIND_SLOTS'} onClick={() => setActiveTab('FIND_SLOTS')} />
          <SidebarItem icon="bookmark" label="My Bookings" active={activeTab === 'MY_BOOKINGS'} onClick={() => setActiveTab('MY_BOOKINGS')} />
          <SidebarItem icon="users" label="Students" active={false} onClick={() => {}} />
          <SidebarItem icon="bell" label="Notifications" active={false} onClick={() => {}} badge="3" />
          <SidebarItem icon="help" label="Help & Support" active={false} onClick={() => {}} />
        </nav>
        <div className="p-4 flex justify-center border-t border-slate-100 mt-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full mx-auto flex items-center justify-center text-indigo-400 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
            <p className="text-xs font-semibold text-slate-600">Stronger Conversations</p>
            <p className="text-xs text-slate-400">Brighter Futures</p>
            <p className="text-[10px] text-slate-300 mt-4">EduPTM v1.0.0</p>
          </div>
        </div>
      </aside>

      {/* MAIN FEED */}
      <main className="flex-1 overflow-y-auto border-r border-slate-200">
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
          
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
                Good afternoon, Rajesh! <span className="ml-2 text-2xl">👋</span>
              </h1>
              <p className="text-slate-500 mt-1">Stay connected with your child's learning journey.</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center bg-white border border-slate-200 rounded-full py-1.5 px-4 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center mr-3">
                {/* Simulated child photo */}
                <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-semibold text-slate-800 leading-tight">Aarav Singh</p>
                <p className="text-[10px] text-slate-500">Class 8A <span className="mx-1">•</span> Roll No. 12</p>
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center cursor-pointer hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-slate-800 leading-none">{upcomingCount}</p>
                <p className="text-sm text-slate-500 mt-1">Upcoming Meetings</p>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-slate-800 leading-none">{completedCount}</p>
                <p className="text-sm text-slate-500 mt-1">Completed</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-slate-800 leading-none">0</p>
                <p className="text-sm text-slate-500 mt-1">Yet to Book</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200 mb-6 flex justify-center space-x-12">
            <button 
              onClick={() => setActiveTab('FIND_SLOTS')} 
              className={`pb-4 px-2 text-sm font-medium flex items-center transition-all ${activeTab === 'FIND_SLOTS' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:border-slate-300 border-b-2 border-transparent'}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Find Slots
            </button>
            <button 
              onClick={() => setActiveTab('MY_BOOKINGS')} 
              className={`pb-4 px-2 text-sm font-medium flex items-center transition-all ${activeTab === 'MY_BOOKINGS' || activeTab === 'DASHBOARD' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:border-slate-300 border-b-2 border-transparent'}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              My Bookings
            </button>
            <button 
              className="pb-4 px-2 text-sm font-medium flex items-center text-slate-500 hover:text-slate-700 transition-all border-b-2 border-transparent cursor-not-allowed opacity-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Calendar View
            </button>
          </div>

          {/* Dynamic Content based on Tabs */}
          {(activeTab === 'MY_BOOKINGS' || activeTab === 'DASHBOARD') ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-4">My Bookings ({myBookings.length})</h2>
              {loadingBookings ? (
                <div className="text-slate-500">Loading your bookings...</div>
              ) : myBookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                  <p className="text-slate-500">You have no booked slots.</p>
                  <button onClick={() => setActiveTab('FIND_SLOTS')} className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md font-medium text-sm hover:bg-indigo-100 transition-colors">Find Available Slots</button>
                </div>
              ) : (
                myBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg mr-4 flex-shrink-0">
                            {booking.teacher_id.split(' ')[0][0] + booking.teacher_id.split(' ')[1][0]}
                          </div>
                          <div>
                            <div className="flex items-center flex-wrap gap-2">
                              <h3 className="text-lg font-bold text-slate-900">{booking.teacher_id.split('(')[0].trim()}</h3>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wide">
                                {booking.teacher_id.split('(')[1]?.replace(')', '') || 'Subject'}
                              </span>
                            </div>
                            <p className="text-slate-600 text-sm mt-1 font-medium">{booking.event_title}</p>
                            <p className="text-slate-500 text-xs mt-1">Discussing academic progress, assessment results and areas for improvement.</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                          {booking.status ? booking.status.replace('_', ' ') : 'BOOKED'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-6">
                        <div className="flex items-center text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          {new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex items-center text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {booking.start_time.slice(0,5)} - {booking.end_time.slice(0,5)}
                        </div>
                        <div className="flex items-center text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          {booking.mode === 'IN_PERSON' ? 'On Campus' : 'Online (EduPTM)'}
                        </div>
                      </div>

                      {/* Remarks */}
                      {booking.teacher_remarks && (
                        <div className="mt-6 bg-[#f8faff] rounded-lg border border-[#e2e8f0] overflow-hidden">
                          <div className="bg-[#f1f5f9] px-4 py-2 border-b border-[#e2e8f0] flex items-center text-sm font-semibold text-slate-700">
                            <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            Teacher Remarks
                          </div>
                          <div className="p-4 text-sm text-slate-600 italic">
                            "{booking.teacher_remarks}"
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex justify-end space-x-3 items-center">
                      <button className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        View Details
                      </button>
                      
                      {booking.status === 'BOOKED' && (
                        <>
                          <button className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            Reschedule
                          </button>
                          
                          {booking.meeting_link ? (
                            <button 
                              onClick={() => setActiveMeetingLink(booking.meeting_link)}
                              className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                              Join Video Call
                            </button>
                          ) : (
                            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm">
                              Add to Calendar
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : !selectedEvent ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Events</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {events.length === 0 && <p className="text-slate-500">No upcoming events found.</p>}
                {events.map((evt) => (
                  <div 
                    key={evt.id} 
                    onClick={() => handleSelectEvent(evt)}
                    className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-indigo-500 transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{evt.title}</h2>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {evt.mode.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-4 flex items-center text-sm font-medium">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {new Date(evt.date).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-slate-500 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {evt.start_time.slice(0,5)} - {evt.end_time.slice(0,5)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedEvent.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">Available Slots</p>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Back
                </button>
              </div>
              
              <div className="p-6 bg-slate-50/30">
                {loading ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {slots.map((slot) => (
                      <div 
                        key={slot.id} 
                        className={`p-5 rounded-xl border transition-all ${slot.is_booked ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm mr-3">
                            {slot.teacher_id.split(' ')[0][0] + slot.teacher_id.split(' ')[1][0]}
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${slot.is_booked ? 'bg-slate-200 text-slate-500' : 'bg-green-100 text-green-700'}`}>
                            {slot.is_booked ? 'Booked' : 'Available'}
                          </span>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-bold text-slate-900">{slot.teacher_id.split('(')[0].trim()}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{slot.teacher_id.split('(')[1]?.replace(')', '') || 'Subject'}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm text-slate-700 font-medium">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {slot.start_time.slice(0,5)} - {slot.end_time.slice(0,5)}
                        </div>
                        
                        {!slot.is_booked && (
                          <button
                            onClick={() => handleBookSlot(slot.id)}
                            className="mt-4 w-full py-2.5 rounded-md text-sm font-semibold transition-colors bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          >
                            Book Slot
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="w-80 bg-slate-50 hidden xl:block border-l border-slate-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          
          {/* Next Meeting Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 flex items-center text-sm">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Your Next Meeting
              </h3>
              <a href="#" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide">View All &rarr;</a>
            </div>

            {myBookings.filter(b => b.status === 'BOOKED' || b.status === 'IN_PROGRESS').length > 0 ? (
              (() => {
                const nextMeeting = myBookings.filter(b => b.status === 'BOOKED' || b.status === 'IN_PROGRESS')[0];
                return (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm mr-3">
                        {nextMeeting.teacher_id.split(' ')[0][0] + nextMeeting.teacher_id.split(' ')[1][0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{nextMeeting.teacher_id.split('(')[0].trim()} <span className="px-1.5 py-0.5 ml-1 bg-slate-100 text-slate-500 text-[9px] rounded font-semibold">{nextMeeting.teacher_id.split('(')[1]?.replace(')', '')}</span></h4>
                        <p className="text-xs text-slate-500 mt-0.5 truncate w-40">{nextMeeting.event_title}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-slate-600 flex items-center">
                        <svg className="w-3.5 h-3.5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {new Date(nextMeeting.date).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-600 flex items-center">
                        <svg className="w-3.5 h-3.5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {nextMeeting.start_time.slice(0,5)} - {nextMeeting.end_time.slice(0,5)}
                      </p>
                      <p className="text-xs text-slate-600 flex items-center">
                        <svg className="w-3.5 h-3.5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {nextMeeting.mode === 'IN_PERSON' ? 'On Campus' : 'Online (EduPTM)'}
                      </p>
                    </div>
                    {nextMeeting.meeting_link && (
                      <button 
                        onClick={() => setActiveMeetingLink(nextMeeting.meeting_link)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition-colors"
                      >
                        Join Video Call &rarr;
                      </button>
                    )}
                  </div>
                );
              })()
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No upcoming meetings scheduled.</p>
            )}
          </div>

          {/* Mini Calendar (Mocked Visual) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 text-sm">October 2026</h3>
              <div className="flex space-x-1">
                <button className="text-slate-400 hover:text-slate-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
                <button className="text-slate-400 hover:text-slate-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 mb-2">
              <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-700">
              <div className="py-1 text-slate-300">28</div><div className="py-1 text-slate-300">29</div><div className="py-1 text-slate-300">30</div><div className="py-1">1</div><div className="py-1">2</div><div className="py-1 text-slate-400">3</div><div className="py-1 text-slate-400">4</div>
              <div className="py-1">5</div><div className="py-1">6</div><div className="py-1">7</div><div className="py-1">8</div><div className="py-1">9</div><div className="py-1 text-slate-400">10</div><div className="py-1 text-slate-400">11</div>
              <div className="py-1 text-indigo-600 font-bold relative">12<span className="w-1 h-1 bg-indigo-500 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2"></span></div>
              <div className="py-1 font-medium relative">13<span className="w-1 h-1 bg-green-500 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2"></span></div>
              <div className="py-1 font-medium">14</div>
              <div className="py-1 bg-indigo-600 text-white rounded-md font-bold shadow-sm relative">15</div>
              <div className="py-1 text-indigo-600 font-bold relative">16<span className="w-1 h-1 bg-indigo-500 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2"></span></div>
              <div className="py-1 text-slate-400">17</div><div className="py-1 text-slate-400">18</div>
              <div className="py-1">19</div><div className="py-1">20</div><div className="py-1">21</div><div className="py-1">22</div><div className="py-1">23</div><div className="py-1 text-slate-400">24</div><div className="py-1 text-slate-400">25</div>
              <div className="py-1">26</div><div className="py-1">27</div><div className="py-1">28</div><div className="py-1">29</div><div className="py-1">30</div><div className="py-1">31</div><div className="py-1 text-slate-300">1</div>
            </div>
          </div>

          {/* Need Help Widget */}
          <div className="bg-[#fffdf0] border border-[#fef08a] rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            </div>
            <div className="pl-12">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Need Help?</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">If you face any issues booking a meeting, please contact the school administration.</p>
              <button className="flex items-center text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-md px-3 py-1.5 hover:bg-indigo-50 transition-colors bg-white">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </aside>

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

function SidebarItem({ icon, label, active, onClick, badge }) {
  const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>,
    bookmark: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>,
    bell: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>,
    help: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center">
        <svg className={`w-5 h-5 mr-3 ${active ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icons[icon]}
        </svg>
        {label}
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}
