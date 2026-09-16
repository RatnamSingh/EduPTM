import { useState } from 'react';

export default function VideoMeeting({ meetingLink, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!meetingLink) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="text-white font-medium">Live PTM Meeting</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleCopyLink}
              className="flex items-center px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-sm font-medium text-white rounded-lg transition-colors border border-slate-600"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                  Copy Link
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
        
        <div className="flex-grow bg-black relative">
          <iframe 
            src={meetingLink} 
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="w-full h-full border-none"
            title="Video Meeting"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
