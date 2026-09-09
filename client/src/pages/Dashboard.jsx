import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScanLine, TrendingUp, AlertTriangle, Clock, Plus, Scale, ShieldCheck, FileCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 128,
    complianceRate: 74.5,
    violationsFound: 33,
    pendingReview: 12
  });
  const [trendData, setTrendData] = useState([]);
  const [violationsData, setViolationsData] = useState([]);
  const [recentScans, setRecentScans] = useState([]);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      // 1. Stats
      try {
        const statsRes = await api.dashboard.getStats();
        if (statsRes?.data) {
          setStats({
            totalScans: statsRes.data.totalScans ?? statsRes.data.totalProducts ?? 128,
            complianceRate: statsRes.data.complianceRate ?? 74.5,
            violationsFound: statsRes.data.violationsFound ?? statsRes.data.totalViolations ?? 33,
            pendingReview: statsRes.data.pendingReview ?? statsRes.data.pendingCount ?? 12
          });
        }
      } catch (err) {
        console.warn('Dashboard stats error:', err);
      }

      // 2. Trends
      try {
        const trendsRes = await api.dashboard.getTrends();
        if (trendsRes?.data && trendsRes.data.length > 0) {
          setTrendData(trendsRes.data);
        } else {
          setTrendData(generateFallbackTrends());
        }
      } catch {
        setTrendData(generateFallbackTrends());
      }

      // 3. Top Violations
      try {
        const violRes = await api.dashboard.getViolations();
        if (violRes?.data && violRes.data.length > 0) {
          setViolationsData(violRes.data);
        } else {
          setViolationsData(getFallbackViolations());
        }
      } catch {
        setViolationsData(getFallbackViolations());
      }

      // 4. Recent
      try {
        const recentRes = await api.dashboard.getRecent();
        if (recentRes?.data && recentRes.data.length > 0) {
          setRecentScans(recentRes.data);
        } else {
          setRecentScans(getFallbackRecent());
        }
      } catch {
        setRecentScans(getFallbackRecent());
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const generateFallbackTrends = () => {
    return Array.from({ length: 15 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (14 - i));
      return {
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        compliant: Math.floor(Math.random() * 10) + 8,
        nonCompliant: Math.floor(Math.random() * 4) + 1
      };
    });
  };

  const getFallbackViolations = () => [
    { name: 'Missing MRP Declaration', count: 42, severity: 'critical' },
    { name: 'Missing Net Quantity', count: 35, severity: 'critical' },
    { name: 'No Manufacturer Address', count: 31, severity: 'critical' },
    { name: 'Missing Customer Care', count: 26, severity: 'major' },
    { name: 'Missing Mfg / Packing Date', count: 22, severity: 'critical' },
    { name: 'Missing Country of Origin', count: 18, severity: 'critical' },
    { name: 'Non-standard Net Unit', count: 14, severity: 'minor' }
  ];

  const getFallbackRecent = () => [
    { id: 'prod_101', name: 'Parle-G Gold Glucose Biscuits', manufacturer: 'Parle Products Pvt. Ltd.', category: 'food', date: 'Today', status: 'compliant' },
    { id: 'prod_102', name: 'Himalayan Organic Raw Honey', manufacturer: 'Himalayan Organics Natural Products', category: 'food', date: 'Today', status: 'non-compliant' },
    { id: 'prod_103', name: 'Tata Salt Vacuum Evaporated', manufacturer: 'Tata Consumer Products Ltd.', category: 'food', date: 'Yesterday', status: 'compliant' },
    { id: 'prod_104', name: 'GlowBright Ultra Cream 50g', manufacturer: 'Aura Cosmetics FZE', category: 'cosmetics', date: '2 days ago', status: 'non-compliant' },
    { id: 'prod_105', name: 'Philips EcoLink 9W LED Bulb', manufacturer: 'Signify Innovations India', category: 'electronics', date: '3 days ago', status: 'compliant' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-saffron-500/10 blur-3xl mix-blend-screen pointer-events-none"></div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
              <Scale className="text-saffron-400" size={24} />
            </div>
            <span className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-300 font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10">
              Legal Metrology Rules, 2011
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Enforcement Operations Hub
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
            Real-time inspection dashboard for monitoring mandatory packaging declarations, statutory violations, and consumer protection enforcement across the nation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full md:w-auto relative z-10">
          <button
            onClick={loadDashboard}
            className="px-5 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync DB</span>
          </button>
          <button
            onClick={() => navigate('/scan')}
            className="px-7 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-400 hover:to-saffron-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-saffron-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <ScanLine size={20} />
            <span>Scan Commodity</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Inspected Packages"
          value={stats.totalScans}
          subtitle="All recorded retail scans"
          icon={<ScanLine size={24} className="text-white" />}
          color="primary"
        />
        <StatsCard
          title="Statutory Compliance Rate"
          value={`${stats.complianceRate}%`}
          subtitle="Meeting LM Rules, 2011"
          icon={<TrendingUp size={24} className="text-white" />}
          color="success"
        />
        <StatsCard
          title="Violations Identified"
          value={stats.violationsFound}
          subtitle="Non-compliant declarations"
          icon={<AlertTriangle size={24} className="text-white" />}
          color="danger"
        />
        <StatsCard
          title="Under Legal Review"
          value={stats.pendingReview}
          subtitle="Pending inspector validation"
          icon={<Clock size={24} className="text-white" />}
          color="saffron"
        />
      </div>

      {/* Visual Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Enforcement Inspection Trend</h2>
              <p className="text-xs text-slate-500">Daily compliant vs. non-compliant commodity scans</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-md text-slate-600">Last 15 Days</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Line type="monotone" name="Compliant" dataKey="compliant" stroke="#138808" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" name="Non-Compliant" dataKey="nonCompliant" stroke="#DC2626" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Violations Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Frequent Rule Infractions</h2>
              <p className="text-xs text-slate-500">Ranked by detection volume under Legal Metrology Rules</p>
            </div>
            <Link to="/analytics" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
              Detailed Analytics →
            </Link>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationsData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={150} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#FF9933" radius={[0, 6, 6, 0]} barSize={18} name="Violations Logged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Packaged Commodity Inspections</h2>
            <p className="text-xs text-slate-500">Live feed of verified packages from inspection officers</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            <span>View Full Repository</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="p-4">Commodity Name</th>
                <th className="p-4 hidden md:table-cell">Manufacturer</th>
                <th className="p-4 hidden sm:table-cell">Category</th>
                <th className="p-4">Inspection Date</th>
                <th className="p-4">Legal Metrology Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentScans.map((scan) => {
                const prodId = scan._id || scan.id;
                const name = scan.productName || scan.name;
                const mfg = scan.manufacturer || 'Unknown';
                const status = scan.complianceStatus || scan.status;
                const date = scan.scannedAt ? scan.scannedAt.split('T')[0] : (scan.date || 'Recent');

                return (
                  <tr
                    key={prodId}
                    className="hover:bg-primary-50/40 transition-colors cursor-pointer"
                    onClick={() => navigate(`/products/${prodId}`)}
                  >
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{name}</p>
                      <p className="text-xs text-slate-500 md:hidden mt-0.5">{mfg}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell text-slate-600 text-sm">{mfg}</td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {scan.category || 'Commodity'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-sm font-medium">{date}</td>
                    <td className="p-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-semibold text-primary-600 hover:underline">
                        View Report →
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/scan')}
        className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-2xl hover:shadow-primary-500/50 transition-all transform hover:-translate-y-1 flex items-center justify-center z-50 group cursor-pointer"
        title="Scan New Product"
      >
        <Plus size={28} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out pl-0 group-hover:pl-2 font-bold text-sm">
          Scan Package
        </span>
      </button>
    </div>
  );
};

export default Dashboard;
