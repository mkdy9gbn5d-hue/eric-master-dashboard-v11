import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY! });

export async function POST(req: Request) {
  const { taskId } = await req.json();
  
  await notion.pages.update({
    page_id: taskId,
    properties: {
      Status: { select: { name: 'Done' } },
    },
  });

  return NextResponse.json({ success: true });
}
