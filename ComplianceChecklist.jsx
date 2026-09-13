import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const ComplianceChecklist = ({ checkResults }) => {
  const [expandedRows, setExpandedRows] = useState({});

  if (!checkResults || checkResults.length === 0) return null;

  const passedCount = checkResults.filter(r => r.passed).length;
  const totalCount = checkResults.length;
  const score = Math.round((passedCount / totalCount) * 100);

  const toggleRow = (index) => {
    setExpandedRows(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const sortedResults = [...checkResults].sort((a, b) => {
    if (a.passed === b.passed) return 0;
    return a.passed ? 1 : -1;
  });

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: 'bg-danger-100 text-danger-700',
      major: 'bg-saffron-100 text-saffron-700',
      minor: 'bg-yellow-100 text-yellow-800'
    };
    const colorClass = colors[severity] || colors.minor;
    return <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${colorClass}`}>{severity}</span>;
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Compliance Results</h3>
          <p className="text-sm text-slate-500">Based on Legal Metrology (Packaged Commodities) Rules, 2011</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-2xl font-bold text-slate-800">{score}%</span>
            <p className="text-xs text-slate-500">Score</p>
          </div>
          <div className="h-10 w-10 rounded-full border-4 flex items-center justify-center text-sm font-bold" 
               style={{ borderColor: score === 100 ? '#138808' : score >= 80 ? '#FF9933' : '#DC2626' }}>
            {passedCount}/{totalCount}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Rule</th>
              <th className="px-6 py-3 font-medium">Reference</th>
              <th className="px-6 py-3 font-medium">Severity</th>
              <th className="px-6 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedResults.map((result, idx) => (
              <React.Fragment key={idx}>
                <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toggleRow(idx)}>
                  <td className="px-6 py-4">
                    {result.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-success-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-danger-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{result.ruleName}</td>
                  <td className="px-6 py-4 text-slate-500">{result.ruleReference}</td>
                  <td className="px-6 py-4">{getSeverityBadge(result.severity)}</td>
                  <td className="px-6 py-4 flex items-center justify-between text-slate-700">
                    <span className="truncate max-w-xs">{result.details}</span>
                    {expandedRows[idx] ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </td>
                </tr>
                {expandedRows[idx] && (
                  <tr className="bg-slate-50">
                    <td colSpan="5" className="px-6 py-4">
                      <div className="p-3 bg-white rounded border border-slate-200">
                        <strong className="text-slate-700">Detailed Feedback:</strong>
                        <p className="mt-1 text-slate-600">{result.details}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplianceChecklist;
