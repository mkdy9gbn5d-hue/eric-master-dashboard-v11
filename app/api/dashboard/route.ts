import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY! });

export async function GET() {
  const [tasksRes, tslaRes, weatherRes] = await Promise.all([
    notion.databases.query({
      database_id: '0c497bd4-0f33-4133-b2e4-3ec6fc61a06a',
      filter: { property: 'Status', select: { does_not_equal: 'Done' } },
      sorts: [{ property: 'Priority', direction: 'ascending' }],
      page_size: 7,
    }),
    fetch('https://query1.finance.yahoo.com/v8/finance/chart/TSLA?interval=1d&range=1d'),
    fetch('https://api.open-meteo.com/v1/forecast?latitude=45.3573&longitude=-122.6068&current=temperature_2m&timezone=America/Denver'),
  ]);

  const tsla = await tslaRes.json();
  const weather = await weatherRes.json();

  return NextResponse.json({
    tasks: tasksRes.results.map((t: any) => ({
      id: t.id,
      name: t.properties['Task Name']?.title?.[0]?.text?.content || 'Untitled',
      priority: t.properties.Priority?.select?.name || 'Medium',
      energy: t.properties.Energy?.select?.name || 'Medium',
    })),
    tsla: {
      price: tsla.chart.result[0].meta.regularMarketPrice,
      change: tsla.chart.result[0].meta.regularMarketChangePercent,
    },
    weather: weather.current.temperature_2m,
    priorities: [
      "$5M Retirement (TSLA-heavy) — On track",
      "Home Value Appreciation (Jada Way $606k baseline)",
      "Family Memories (Bridget, Jensen, Taylor)",
      "OHSU Revenue Cycle 10x Transformation 2026-2031",
      "Sustain Personal Energy, Health & Relationships",
    ],
  });
}
