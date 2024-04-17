import { prisma } from '@/app/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return Response.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email} = await req.json();
    const newUser = await prisma.user.create({
      data: {
        name,
        email
      },
    });
    Response.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
  }
}
