import { prisma } from '@/app/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try{
    const collection_id = params.id;
    const bids = await prisma.bid.findMany({
      where: {
        collection_id: parseInt(collection_id as string),
      },
      orderBy: {
        price: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    return Response.json({ bids })
  } catch (error: any) {  
    return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const collection_id = parseInt(params.id);
    const { price, user_id } = await req.json();
    const newBid = await prisma.bid.create({
      data: {
        price,
        collection: {
          connect: {
            id: collection_id
          }
        },
        user: {
          connect: {
            id: user_id
          }
        }
      },
    });
    return Response.json(newBid);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
  }
}