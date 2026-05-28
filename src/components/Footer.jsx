import React from 'react';

export const Footer = ({ triggerNotification }) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-slate-500 font-medium">
          © 2026 IFTIN TRICKS Inc. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-slate-400">
          <button onClick={() => triggerNotification("Terms of Service window coming soon")} className="hover:text-slate-600 transition-colors">Terms</button>
          <button onClick={() => triggerNotification("Privacy parameters are securely active")} className="hover:text-slate-600 transition-colors">Privacy</button>
          <button onClick={() => triggerNotification("Support desk contact: support@iftintricks.com")} className="hover:text-slate-600 transition-colors">Support Desk</button>
        </div>
      </div>
    </footer>
  );
};
