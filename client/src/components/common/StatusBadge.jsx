import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
  let badgeClasses = 'flex items-center w-max px-3 py-1 rounded-full text-sm font-medium ';
  let Icon = null;
  let text = '';

  switch (status) {
    case 'compliant':
      badgeClasses += 'bg-success-500 text-white';
      Icon = CheckCircle;
      text = 'Compliant';
      break;
    case 'non-compliant':
      badgeClasses += 'bg-danger-500 text-white';
      Icon = XCircle;
      text = 'Non-Compliant';
      break;
    case 'pending':
    default:
      badgeClasses += 'bg-yellow-400 text-slate-900';
      Icon = Clock;
      text = 'Pending';
      break;
  }

  return (
    <span className={badgeClasses}>
      <Icon className="mr-1.5 h-4 w-4" />
      {text}
    </span>
  );
};

export default StatusBadge;
