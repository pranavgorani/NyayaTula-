import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, User as UserIcon, Check, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title = 'Dashboard', subtitle, toggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Close notifications if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifRef]);

  const mockNotifications = [
    { id: 1, type: 'alert', title: 'Compliance Alert', text: 'New critical violation detected in Zone A.', time: '10m ago', icon: AlertTriangle, color: 'text-danger-500', bg: 'bg-danger-50' },
    { id: 2, type: 'success', title: 'System Update', text: 'Gemini AI Vision module is now active.', time: '1h ago', icon: Check, color: 'text-success-500', bg: 'bg-success-50' },
    { id: 3, type: 'info', title: 'Weekly Report', text: 'Your automated enforcement report is ready.', time: '2h ago', icon: Info, color: 'text-primary-500', bg: 'bg-primary-50' }
  ];

  return (
    <header id="header" className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 mr-4 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 font-medium hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Search */}
        <div className={`flex items-center transition-all duration-300 ${searchExpanded ? 'w-48 sm:w-64' : 'w-10'}`}>
          <div className="relative w-full">
            <button 
              onClick={() => setSearchExpanded(!searchExpanded)}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-primary-600 z-10 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
            <input 
              type="text" 
              placeholder="Quick search..." 
              className={`w-full py-1.5 pl-9 pr-4 bg-slate-100/80 border-transparent text-sm rounded-full focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200/50 transition-all shadow-inner ${searchExpanded ? 'opacity-100 cursor-text' : 'opacity-0 cursor-pointer pointer-events-none'}`}
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                <span className="text-xs text-primary-600 font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map(notif => {
                  const NotifIcon = notif.icon;
                  return (
                    <div key={notif.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                      <div className={`mt-1 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${notif.bg} ${notif.color}`}>
                        <NotifIcon size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{notif.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{notif.text}</p>
                        <p className="text-[0.65rem] text-slate-400 mt-1 font-medium">{notif.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div 
                onClick={() => { setShowNotifications(false); navigate('/analytics'); }}
                className="p-3 text-center text-xs font-semibold text-primary-600 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border-t border-slate-100"
              >
                View Analytics Dashboard
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown Toggle (Visual Only) */}
        <div className="flex items-center cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 shadow-sm border border-primary-200/50">
            {user?.name ? user.name.charAt(0) : <UserIcon className="h-4 w-4" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
