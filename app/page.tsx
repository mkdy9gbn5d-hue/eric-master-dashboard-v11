'use client';

import { useState, useEffect } from 'react';

export default function MasterDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#e31937] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[420px] mx-auto min-h-screen bg-[#0a0a0a] p-4 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-[11px] text-[#e31937] tracking-[3px]">GROK ORCHESTRATOR v10</div>
          <div className="text-3xl font-semibold">MASTER DASHBOARD</div>
        </div>
        <div className="text-right text-xs text-gray-400">
          {new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' })} EST
        </div>
      </div>

      {/* Portfolio */}
      <div className="bg-[#1f1f1f] border border-[#333] rounded-2xl p-5 mb-4">
        <div className="flex justify-between">
          <div>
            <div className="text-xs text-gray-400">RETIREMENT PORTFOLIO</div>
            <div className="text-5xl font-semibold">$616k</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">TSLA</div>
            <div className="text-3xl font-semibold">${data.tsla?.price || '---'}</div>
            <div className={data.tsla?.change >= 0 ? 'text-green-400' : 'text-red-400'}>
              {data.tsla?.change ? (data.tsla.change > 0 ? '+' : '') + data.tsla.change.toFixed(2) + '%' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Global Context */}
      <div className="bg-[#1f1f1f] border border-[#333] rounded-2xl p-5 mb-4">
        <div className="text-[#e31937] text-xs tracking-widest mb-3">GLOBAL CONTEXT PRIORITIES</div>
        <div className="space-y-2 text-sm">
          {data.priorities?.map((p: string, i: number) => (
            <div key={i} className="flex gap-3">
              <span className="text-[#e31937] font-mono text-xs mt-0.5">{i + 1}</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-[#1f1f1f] border border-[#333] rounded-2xl p-5 mb-4">
        <div className="flex justify-between mb-3">
          <div className="text-[#e31937] text-xs tracking-widest">TODAY'S MUST-DOS</div>
          <div className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{data.tasks?.length || 0} open</div>
        </div>
        
        <div className="space-y-2 text-sm">
          {data.tasks?.length > 0 ? data.tasks.map((task: any, index: number) => (
            <div key={index} className="flex justify-between py-2 border-b border-white/10 last:border-0">
              <div>{task.name}</div>
              <div className="text-xs text-gray-400">{task.priority}</div>
            </div>
          )) : (
            <div className="text-emerald-400">All clear!</div>
          )}
        </div>
      </div>

      {/* Weather */}
      <div className="bg-[#1f1f1f] border border-[#333] rounded-2xl p-5">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-400">JADA WAY, OREGON CITY</div>
            <div className="text-5xl font-semibold">{data.weather || '--'}°F</div>
          </div>
          <div className="text-emerald-400 text-sm">Watering: Light</div>
        </div>
      </div>

      <div className="text-center text-[10px] text-gray-500 mt-8">
        v10 • Synced from Notion
      </div>
    </div>
  );
}
