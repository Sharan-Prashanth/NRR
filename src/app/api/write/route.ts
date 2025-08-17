import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const filePath = path.join(process.cwd(), 'public', 'data.json');

  let existing = [];
  try {
    const file = await fs.readFile(filePath, 'utf-8');
    existing = JSON.parse(file);
  } catch (err) {
    existing = [];
  }

  existing.push(body.data);

  await fs.writeFile(filePath, JSON.stringify(existing, null, 2));

  return NextResponse.json({ message: 'Data saved' });
}
