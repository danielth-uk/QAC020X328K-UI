import React from "react";

const LargeLoading = () => {
  return (
    <div className="animate-pulse mt-8">
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 bg-slate-700 rounded"></div>
        <div className="h-2 bg-slate-700 rounded"></div>
        <div className="h-2 bg-slate-700 rounded"></div>
        <div className="h-2 bg-slate-700 rounded"></div>
        <div className="h-2 bg-slate-700 rounded"></div>
      </div>
    </div>
  );
};

export default LargeLoading;
