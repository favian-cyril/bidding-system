import { prisma } from '@/app/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collection_id = parseInt(params.id);
    const { bid_id } = await req.json();
    const [_, acceptedBid] = await Promise.all([
      prisma.bid.updateMany({
        where: {
          collection_id,
          id: { not: parseInt(bid_id as string) },
        },
        data: {
          status: 'rejected',
        },
      }),
      prisma.bid.update({
        where: {
          id: parseInt(bid_id as string),
        },
        data: {
          status: 'accepted',
        },
      }),
      prisma.collection.update({
        where: {
          id: collection_id,
        },
        data: {
          isComplete: true
        }
      })
    ])
    return Response.json(acceptedBid)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
  }
}