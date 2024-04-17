import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const cursor = searchParams.get('cursor');
    const limit = searchParams.get('limit') || 10;
    const collections = await prisma.collection.findMany({
      skip: cursor ? 1 : undefined,
      take: parseInt(limit as string) + 1, // Fetch one extra record to check if there are more data
      cursor: cursor ? { id: parseInt(cursor as string) } : undefined,
      orderBy: { id: 'desc' },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });
    
    const hasNextPage = collections.length > parseInt(limit as string);
    // Remove the extra record from collections array
    if (hasNextPage) {
      collections.pop();
    }
    const lastCursor = collections.length > 0 ? collections[collections.length - 1].id : null;
    return Response.json({ collections, lastCursor, hasNextPage });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, stocks, price, user_id } = await req.json();
    const newCollection = await prisma.collection.create({
      data: {
        name,
        description,
        stocks,
        price,
        user: {
          connect: {
            id: user_id
          }
        }
      },
    });
    return Response.json(newCollection);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, name, description, stocks, price } = await req.json();
    const updated = await prisma.collection.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        stocks,
        price,
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })
    return Response.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.collection.delete({
      where: {
        id,
      }
    });
    return Response.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
  }
}