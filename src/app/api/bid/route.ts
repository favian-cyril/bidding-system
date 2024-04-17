import { prisma } from "@/app/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { id, price } = await req.json();
    const updated = await prisma.bid.update({
      where: {
        id,
      },
      data: {
        id,
        price
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
    await prisma.bid.delete({
      where: {
        id,
      }
    });
    return Response.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
  }
}