import { Client } from '@notionhq/client';
import { revalidatePath } from 'next/cache';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getDashboardData() {
  // Global Context
  const globalContext = await notion.pages.retrieve({ 
    page_id: '35bd8c2c-c49c-8108-b08c-dca495cb9818' 
  });

  // Tasks (incomplete only)
  const tasksResponse = await notion.databases.query({
    database_id: '0c497bd4-0f33-4133-b2e4-3ec6fc61a06a',
    filter: { property: 'Status', select: { does_not_equal: 'Done' } },
    sorts: [
      { property: 'Priority', direction: 'ascending' },
      { property: 'Due Date', direction: 'ascending' },
    ],
    page_size: 7,
  });

  // TSLA price (Yahoo public)
  const tslaRes = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/TSLA?interval=1d&range=1d');
  const tslaData = await tslaRes.json();
  const tslaPrice = tslaData.chart.result[0].meta.regularMarketPrice;
  const tslaChange = tslaData.chart.result[0].meta.regularMarketChangePercent;

  // Weather (Oregon City)
  const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=45.3573&longitude=-122.6068&current=temperature_2m&daily=precipitation_sum&timezone=America/Los_Angeles');
  const weather = await weatherRes.json();

  return {
    globalContext: (globalContext as any).properties,
    tasks: tasksResponse.results,
    tsla: { price: tslaPrice, change: tslaChange },
    weather: weather.current.temperature_2m,
  };
}

export default async function MasterDashboard() {
  const data = await getDashboardData();

  return (
    <div className="max-w-[420px] mx-auto min-h-screen bg-[#0a0a0a] p-4 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-[11px] text-[#e31937] tracking-[3px]">GROK ORCHESTRATOR v10</div>
          <div className="text-2xl font-semibold">MASTER DASHBOARD</div>
        </div>
        <div className="text-right text-xs text-gray-400">
          {new Date().toLocaleTimeString('en-US', { timeZone: 'America/Denver' })} MST<br />
          San José del Cabo
        </div>
      </div>

      {/* Portfolio + TSLA */}
      <div className="card p-5 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-gray-400">RETIREMENT PORTFOLIO</div>
            <div className="text-4xl font-semibold tabular-nums">$616k</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">TSLA LIVE</div>
            <div className="text-3xl font-semibold tabular-nums">${data.tsla.price}</div>
            <div className={data.tsla.change >= 0 ? 'text-green-400' : 'text-red-400'}>
              {data.tsla.change > 0 ? '+' : ''}{data.tsla.change.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Global Context Priorities */}
      <div className="card p-5 mb-4">
        <div className="text-xs text-[#e31937] mb-3 tracking-widest">GLOBAL CONTEXT PRIORITIES</div>
        <div className="space-y-3 text-sm">
          <div>1. <span className="font-medium">$5M Retirement (TSLA-heavy)</span> — On track</div>
          <div>2. <span className="font-medium">Home Value Appreciation</span> — Jada Way baseline $606k</div>
          <div>3. <span className="font-medium">Family Memories</span> — Active</div>
          <div>4. <span className="font-medium">OHSU Revenue Cycle 10x</span> — 2026-2031</div>
          <div>5. <span className="font-medium">Energy & Health</span> — Foundational</div>
        </div>
      </div>

      {/* Today's Must-Dos */}
      <div className="card p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs text-[#e31937] tracking-widest">TODAY'S MUST-DOS</div>
          <div className="text-[10px] px-2 py-0.5 rounded-full bg-white/10">{data.tasks.length} open</div>
        </div>
        <div className="space-y-2 text-sm">
          {data.tasks.length > 0 ? data.tasks.map((task: any, i: number) => (
            <div key={i} className="flex items-center gap-3 py-1 border-b border-white/10 last:border-0">
              <div className="w-2 h-2 rounded-full bg-[#e31937]"></div>
              <div className="flex-1">{task.properties['Task Name']?.title?.[0]?.text?.content || 'Untitled task'}</div>
              <div className="text-[10px] text-gray-400">{task.properties.Priority?.select?.name}</div>
            </div>
          )) : <div className="text-gray-400 text-sm">No open high-priority tasks — excellent.</div>}
        </div>
      </div>

      {/* Weather + Watering */}
      <div className="card p-5 mb-4">
        <div className="flex justify-between">
          <div>
            <div className="text-xs text-gray-400">JADA WAY • OREGON CITY</div>
            <div className="text-4xl font-semibold tabular-nums">{data.weather}°F</div>
          </div>
          <div className="text-right text-sm text-emerald-400">Watering: Light (0.2")</div>
        </div>
      </div>

      <div className="text-[10px] text-center text-gray-500 mt-8">
        Synced from Notion • Next review: Daily 05:30 MST<br />
        v10 • {new Date().toISOString().split('T')[0]}
      </div>
    </div>
  );
}
