import { useState, useEffect } from 'react';
import apiClient from '../api';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { DyteMeeting } from '@dytesdk/react-ui-kit';

function DyteWrapper({ token, onClose }) {
  const [meeting, initMeeting] = useDyteClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initMeeting({
      authToken: token,
      defaults: {
        audio: true,
        video: true,
      },
    }).then(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div className="flex items-center justify-center h-full bg-slate-900 text-white">Initializing Secure Video Room...</div>;
  }

  return (
    <div className="h-full w-full relative bg-slate-900">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-lg"
      >
        Leave Meeting
      </button>
      <DyteProvider value={meeting}>
        <DyteMeeting meeting={meeting} showSetupScreen={true} />
      </DyteProvider>
    </div>
  );
}

export default function VideoMeeting({ bookingId, meetingLink, isOpen, onClose }) {
  const [dyteToken, setDyteToken] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    if (isOpen && bookingId) {
      setLoadingToken(true);
      apiClient.get(`/bookings/${bookingId}/dyte-token`)
        .then(res => {
          setDyteToken(res.data.token);
        })
        .catch(err => {
          console.log("No dyte token available, falling back to Jitsi", err);
          setDyteToken(null);
        })
        .finally(() => {
          setLoadingToken(false);
        });
    }
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col animate-in fade-in duration-200">
      {/* Fallback to Jitsi if Dyte isn't configured */}
      {!loadingToken && !dyteToken && (
        <>
          <div className="bg-[#1e2336] px-6 py-4 flex justify-between items-center shadow-md">
            <h2 className="text-white font-medium text-lg flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-3 animate-pulse"></span>
              Virtual PTM Room
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-red-500/20 px-4 py-2 rounded-md"
            >
              End Call
            </button>
          </div>
          <div className="flex-grow w-full bg-black">
            {meetingLink ? (
              <iframe 
                src={meetingLink} 
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="w-full h-full border-0"
                title="PTM Video Call"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 flex-col">
                <svg className="w-16 h-16 mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                <p>Generating meeting link...</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Premium Dyte Experience */}
      {!loadingToken && dyteToken && (
        <DyteWrapper token={dyteToken} onClose={onClose} />
      )}
      
      {loadingToken && (
        <div className="flex items-center justify-center h-full bg-slate-900 text-white flex-col">
           <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           <p>Connecting to secure room...</p>
        </div>
      )}
    </div>
  );
}
