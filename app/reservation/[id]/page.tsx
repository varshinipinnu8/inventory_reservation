"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReservationPage() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [reservation, setReservation] =
    useState<any>(null);

  const [timeLeft, setTimeLeft] =
    useState("");

  // Fetch reservation
  async function fetchReservation() {

    const res = await fetch(
      `/api/reservations/${id}`
    );

    const data = await res.json();

    setReservation(data);
  }

  useEffect(() => {

    if (id) {
      fetchReservation();
    }

  }, [id]);

  // Countdown timer
  useEffect(() => {

    if (!reservation) return;

    const interval = setInterval(() => {

      const expiry =
        new Date(
          reservation.expiresAt
        ).getTime();

      const now = Date.now();

      const difference =
        expiry - now;

      if (difference <= 0) {

        setTimeLeft("Expired");

        clearInterval(interval);

        return;
      }

      const minutes =
        Math.floor(
          difference / 1000 / 60
        );

      const seconds =
        Math.floor(
          (difference / 1000) % 60
        );

      setTimeLeft(
        `${minutes}m ${seconds}s`
      );

    }, 1000);

    return () =>
      clearInterval(interval);

  }, [reservation]);

  // Confirm Purchase
  async function confirmReservation() {

    const res = await fetch(
      `/api/reservations/${id}/confirm`,
      {
        method: "POST",
      }
    );

    if (res.status === 410) {

      alert("Reservation expired");

      return;
    }

    alert("Purchase Confirmed");

    router.push("/");
  }

  // Cancel Reservation
  async function cancelReservation() {

    await fetch(
      `/api/reservations/${id}/cancel`,
      {
        method: "POST",
      }
    );

    alert("Reservation Cancelled");

    router.push("/");
  }

  if (!reservation) {

    return (
      <div
        style={{
          padding: "20px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#111827",
        minHeight: "100vh",
        color: "white",
      }}
    >

      <h1
        style={{
          marginBottom: "20px",
        }}
      >
        Reservation Checkout
      </h1>

      <div
        style={{
          backgroundColor: "#1f2937",
          padding: "20px",
          borderRadius: "10px",
        }}
      >

        <p>
          <b>Reservation ID:</b>
          {" "}
          {reservation.id}
        </p>

        <p>
          <b>Status:</b>
          {" "}
          {reservation.status}
        </p>

        <p>
          <b>Quantity:</b>
          {" "}
          {reservation.quantity}
        </p>

        <p>
          <b>Expires In:</b>
          {" "}
          <span
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            {timeLeft}
          </span>
        </p>

        {/* Confirm Button */}
        <button
          onClick={confirmReservation}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            marginTop: "20px",
            marginRight: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Confirm Purchase
        </button>

        {/* Cancel Button */}
        <button
          onClick={cancelReservation}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            marginTop: "20px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Cancel
        </button>

      </div>

    </div>
  );
}