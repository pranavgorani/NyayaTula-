import React, { useState } from 'react';
import { Menu, Search, Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title = 'Dashboard', subtitle, toggleSidebar }) => {
  const { user } = useAuth();
  const [searchExpanded, setSearchExpanded] = useState(false);

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
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"></span>
        </button>

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
