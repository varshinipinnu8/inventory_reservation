import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const inventories = await prisma.inventory.findMany({
    include: {
      product: true,
      warehouse: true,
    },
  });

  const data = inventories.map((item) => ({
    inventoryId: item.id,
    productId: item.productId,
    productName: item.product.name,
    description: item.product.description,
    warehouseId: item.warehouseId,
    warehouseName: item.warehouse.name,
    totalStock: item.totalStock,
    reservedStock: item.reservedStock,
    availableStock: item.totalStock - item.reservedStock,
  }));

  return NextResponse.json(data);
}