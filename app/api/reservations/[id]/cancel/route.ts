import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    // Find reservation
    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: id,
        },
      });

    // Not found
    if (!reservation) {

      return NextResponse.json(
        {
          error: "Reservation not found",
        },
        {
          status: 404,
        }
      );
    }

    // Return stock
    await prisma.inventory.update({
      where: {
        productId_warehouseId: {
          productId:
            reservation.productId,
          warehouseId:
            reservation.warehouseId,
        },
      },
      data: {
        reservedStock: {
          decrement:
            reservation.quantity,
        },
      },
    });

    // Update reservation status
    const updatedReservation =
      await prisma.reservation.update({
        where: {
          id: id,
        },
        data: {
          status: "CANCELLED",
        },
      });

    return NextResponse.json(
      updatedReservation
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}