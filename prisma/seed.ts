import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  // Create products
  const iphone = await prisma.product.create({
    data: {
      name: "iPhone",
      description: "Apple smartphone",
    },
  });

  const laptop = await prisma.product.create({
    data: {
      name: "Laptop",
      description: "High performance laptop",
    },
  });

  // Create warehouses
  const hyderabad = await prisma.warehouse.create({
    data: {
      name: "Hyderabad Warehouse",
      location: "Hyderabad",
    },
  });

  const bangalore = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
      location: "Bangalore",
    },
  });

  // Add inventory
  await prisma.inventory.createMany({
    data: [
      {
        productId: iphone.id,
        warehouseId: hyderabad.id,
        totalStock: 10,
        reservedStock: 0,
      },
      {
        productId: iphone.id,
        warehouseId: bangalore.id,
        totalStock: 5,
        reservedStock: 0,
      },
      {
        productId: laptop.id,
        warehouseId: hyderabad.id,
        totalStock: 8,
        reservedStock: 0,
      }
    ]
  });

  console.log("Seed completed");
}

main()
.catch((e)=>{
  console.error(e);
})
.finally(async ()=>{
  await prisma.$disconnect();
});