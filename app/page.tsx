"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all products
  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  // Load products on page load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Reserve product function
  async function reserveProduct(
    productId: string,
    warehouseId: string
  ) {
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          warehouseId,
          quantity: 1,
        }),
      });

      const data = await res.json();

      // Success message
      if (res.ok) {
        setMessage("Reservation Created Successfully");
      } else {
        setMessage(data.error || "Something went wrong");
      }

      // Refresh products
      fetchProducts();
    } catch (error) {
      setMessage("Server Error");
    }
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "black",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>
        Inventory Dashboard
      </h1>

      {/* Success Message */}
      {message && (
        <div
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>
      )}

      {/* Product Cards */}
      {products.map((item: any) => (
        <div
          key={item.inventoryId}
          style={{
            border: "1px solid gray",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>{item.productName}</h2>

          <p>
            <b>Warehouse:</b> {item.warehouseName}
          </p>

          <p>
            <b>Total Stock:</b> {item.totalStock}
          </p>

          <p>
            <b>Reserved Stock:</b> {item.reservedStock}
          </p>

          <p>
            <b>Available Stock:</b> {item.availableStock}
          </p>

          {/* Reserve Button */}
          <button
            onClick={() =>
              reserveProduct(
                item.productId,
                item.warehouseId
              )
            }
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "10px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Reserve Product
          </button>
        </div>
      ))}
    </div>
  );
}