import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, subtitle, icon, trend, color = 'primary' }) => {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-500 border-primary-100',
    success: 'bg-success-50 text-success-500 border-success-100',
    danger: 'bg-danger-50 text-danger-500 border-danger-100',
    saffron: 'bg-saffron-50 text-saffron-500 border-saffron-100',
    slate: 'bg-slate-50 text-slate-500 border-slate-100',
  };

  const bgClass = colorMap[color] || colorMap.primary;

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm flex items-start justify-between">
      <div className="flex flex-col">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full border ${bgClass}`}>
          {icon}
        </div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="mt-1 text-2xl font-semibold text-slate-900">{value}</h3>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      
      {trend !== undefined && (
        <div className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${trend >= 0 ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}>
          {trend >= 0 ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
};

export default StatsCard;
