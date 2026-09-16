import { useState, useEffect } from 'react'
import ParentBooking from './components/ParentBooking'
import AdminAnalytics from './components/AdminAnalytics'
import TeacherPortal from './components/TeacherPortal'
import Login from './components/Login'
import SSOHandler from './components/SSOHandler'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('ptm_token');
    const savedRole = localStorage.getItem('ptm_role');
    if (token && savedRole) {
      setIsAuthenticated(true);
      setRole(savedRole);
    }
  }, []);

  const handleLoginSuccess = (loggedInRole) => {
    localStorage.setItem('ptm_role', loggedInRole);
    setRole(loggedInRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ptm_token');
    localStorage.removeItem('ptm_role');
    setIsAuthenticated(false);
    setRole(null);
  };

  if (window.location.pathname === '/sso') {
    return <SSOHandler />
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-[#1e2336] text-white p-4 flex justify-between items-center shadow-md border-b border-slate-700">
        <div className="flex items-center">
          <div className="font-bold text-xl ml-4 tracking-tight">Edu<span className="text-indigo-400">PTM</span></div>
          {role === 'PARENT' && <span className="ml-4 text-xs text-slate-400 hidden md:inline">Bridging Parents & Educators</span>}
        </div>
        
        <div className="mr-4 flex items-center space-x-6">
          {role === 'PARENT' ? (
            <>
              <div className="relative cursor-pointer hover:text-indigo-300 transition-colors">
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#1e2336]">3</span>
              </div>
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center font-bold text-sm">
                  RS
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] text-slate-400 leading-none">Welcome,</p>
                  <p className="text-sm font-semibold text-white leading-tight">Rajesh Singh</p>
                </div>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white transition-colors">Logout</button>
            </>
          ) : (
            <>
              <span className="text-sm text-slate-300">Role: <span className="font-semibold text-white">{role}</span></span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="flex-grow">
        {role === 'PARENT' && <ParentBooking />}
        {role === 'TEACHER' && <TeacherPortal />}
        {role === 'ADMIN' && <AdminAnalytics />}
      </main>
    </div>
  )
}

export default App
