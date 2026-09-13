import React, { useState } from 'react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Package, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const Analytics = () => {
  // Mock data for charts
  const monthlyTrendData = [
    { month: 'May', compliant: 120, nonCompliant: 30 },
    { month: 'Jun', compliant: 150, nonCompliant: 45 },
    { month: 'Jul', compliant: 180, nonCompliant: 40 },
    { month: 'Aug', compliant: 160, nonCompliant: 55 },
    { month: 'Sep', compliant: 210, nonCompliant: 35 },
    { month: 'Oct', compliant: 190, nonCompliant: 25 },
  ];

  const violationsPieData = [
    { name: 'Missing MRP', value: 35 },
    { name: 'No Mfg Info', value: 25 },
    { name: 'No Net Qty', value: 20 },
    { name: 'No Care Details', value: 15 },
    { name: 'Others', value: 5 },
  ];
  const COLORS = ['#FF9933', '#DC2626', '#003366', '#475569', '#94a3b8'];

  const categoryBarData = [
    { category: 'Food', compliant: 450, nonCompliant: 85 },
    { category: 'Cosmetics', compliant: 320, nonCompliant: 110 },
    { category: 'Electronics', compliant: 180, nonCompliant: 65 },
    { category: 'Household', compliant: 240, nonCompliant: 40 },
    { category: 'Pharma', compliant: 150, nonCompliant: 15 },
  ];

  const topOffenders = [
    { name: 'Unknown Traders Ltd', scanned: 45, violations: 32, rate: '28%', issue: 'No Manufacturer Address' },
    { name: 'Local Imports Co', scanned: 28, violations: 24, rate: '14%', issue: 'Missing Origin Country' },
    { name: 'Fast Packagings', scanned: 65, violations: 21, rate: '67%', issue: 'Missing MRP Details' },
    { name: 'ABC Foods', scanned: 112, violations: 18, rate: '83%', issue: 'No Net Quantity Unit' },
  ];

  const handleExportCSV = () => {
    let csv = 'Manufacturer,Scanned,Violations,Compliance Rate,Most Common Issue\n';
    topOffenders.forEach(o => {
      csv += `"${o.name}",${o.scanned},${o.violations},"${o.rate}","${o.issue}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'NyayaTula_Analytics_Report.csv';
    link.click();
    toast.success('Analytics CSV exported!');
  };

  const handleExportDocx = () => {
    const dataStr = "NyayaTula Analytics Summary\n\n" + JSON.stringify(topOffenders, null, 2);
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'NyayaTula_Analytics_Report.doc';
    link.click();
    toast.success('Analytics Document exported!');
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClass.bg}`}>
          <Icon size={20} className={colorClass.text} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-20">
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics & Insights</h1>
          <p className="text-slate-500 text-sm">Deep dive into compliance data and trends</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition-colors">
            <Download size={16} /> Excel (CSV)
          </button>
          <button onClick={handleExportDocx} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors">
            <Download size={16} /> Word (DOC)
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Avg Compliance Score" value="73.2%" subtitle="+2.4% from last month"
          icon={Activity} colorClass={{ bg: 'bg-primary-50', text: 'text-primary-600' }} 
        />
        <StatCard 
          title="Most Common Violation" value="MRP Details" subtitle="Accounts for 35% of issues"
          icon={AlertTriangle} colorClass={{ bg: 'bg-danger-50', text: 'text-danger-600' }} 
        />
        <StatCard 
          title="Products Scanned" value="156" subtitle="Current month"
          icon={Package} colorClass={{ bg: 'bg-success-50', text: 'text-success-600' }} 
        />
        <StatCard 
          title="Active Inspectors" value="12" subtitle="Across 4 zones"
          icon={CheckCircle} colorClass={{ bg: 'bg-saffron-50', text: 'text-saffron-600' }} 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Trend Area Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Monthly Compliance Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompliant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#138808" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#138808" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNonCompliant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="compliant" name="Compliant" stroke="#138808" fillOpacity={1} fill="url(#colorCompliant)" />
                <Area type="monotone" dataKey="nonCompliant" name="Non-Compliant" stroke="#DC2626" fillOpacity={1} fill="url(#colorNonCompliant)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations Donut */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Violations by Type</h2>
          <div className="h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={violationsPieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value">
                  {violationsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-32">
              <div className="text-center">
                <span className="text-2xl font-bold text-slate-800">100</span>
                <span className="block text-xs text-slate-500">Violations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Grouped Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Compliance by Product Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="compliant" name="Compliant" fill="#138808" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nonCompliant" name="Non-Compliant" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Offenders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mt-6">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Top Non-Compliant Manufacturers</h2>
          <p className="text-sm text-slate-500">Entities with the highest number of violations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Manufacturer Name</th>
                <th className="p-4 font-medium">Products Scanned</th>
                <th className="p-4 font-medium">Violations</th>
                <th className="p-4 font-medium">Compliance Rate</th>
                <th className="p-4 font-medium">Most Common Issue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topOffenders.map((offender, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 text-sm">{offender.name}</td>
                  <td className="p-4 text-slate-600 text-sm">{offender.scanned}</td>
                  <td className="p-4 text-danger-600 font-semibold text-sm">{offender.violations}</td>
                  <td className="p-4 text-slate-600 text-sm">{offender.rate}</td>
                  <td className="p-4 text-slate-600 text-sm">{offender.issue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
