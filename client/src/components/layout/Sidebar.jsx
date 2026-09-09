import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ScanLine, Package, BarChart3, LogOut, Scale } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/scan', label: 'Scan Product', icon: ScanLine },
    { path: '/products', label: 'Product History', icon: Package },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside 
      id="sidebar"
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out shadow-2xl ${
        isCollapsed ? 'w-0 sm:w-20 overflow-hidden' : 'w-64'
      }`}
    >
      {/* Logo Area */}
      <div className="flex h-16 items-center justify-center border-b border-slate-800 px-4 bg-slate-900">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-1.5 rounded-lg shadow-lg">
            <Scale className={`h-6 w-6 text-white ${isCollapsed ? '' : ''}`} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col ml-3">
              <span className="text-xl font-bold tracking-tight text-white">Nyaya<span className="text-saffron-400">Tula</span></span>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-slate-400">Legal Metrology</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'
              }`
            }
            title={isCollapsed ? item.label : ''}
          >
            <item.icon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${
              window.location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-white'
            }`} />
            {!isCollapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Area */}
      <div className="border-t border-slate-800 p-4 bg-slate-900/50">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex flex-col">
                <span className="text-sm font-bold text-white truncate w-32">{user?.name || 'User'}</span>
                <span className="text-[0.7rem] text-primary-300 font-medium truncate uppercase tracking-wider">{user?.role || 'Authority'}</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-danger-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
        {isCollapsed && (
          <button 
            onClick={logout}
            className="mt-4 w-full flex justify-center p-2.5 text-slate-400 hover:text-danger-400 hover:bg-slate-800 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
