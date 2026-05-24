import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {

  try {

    const body = await request.json();

    const {
      productId,
      warehouseId,
      quantity,
    } = body;

    // Find inventory
    const inventory =
      await prisma.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId,
          },
        },
      });

    // No inventory
    if (!inventory) {

      return NextResponse.json(
        {
          error: "Inventory not found",
        },
        {
          status: 404,
        }
      );
    }

    // Available stock
    const availableStock =
      inventory.totalStock -
      inventory.reservedStock;

    // Not enough stock
    if (availableStock < quantity) {

      return NextResponse.json(
        {
          error: "Not enough stock",
        },
        {
          status: 409,
        }
      );
    }

    // Update reserved stock
    await prisma.inventory.update({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
      data: {
        reservedStock: {
          increment: quantity,
        },
      },
    });

    // Create reservation
    const reservation =
      await prisma.reservation.create({
        data: {
          productId,
          warehouseId,
          quantity,
          status: "PENDING",
          expiresAt: new Date(
            Date.now() + 5 * 60 * 1000
          ),
        },
      });

    return NextResponse.json(
      reservation,
      {
        status: 201,
      }
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