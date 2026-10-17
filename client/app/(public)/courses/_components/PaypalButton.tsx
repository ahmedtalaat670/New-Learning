/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/_stores/auth";

interface PayPalDirectPayButtonProps {
  courseId: number;
  clientId: string;
}

export default function PayPalButton({
  courseId,
  clientId,
}: PayPalDirectPayButtonProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return (
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={() => router.push(`/login?redirectTo=/courses/${courseId}`)}
          className="w-full bg-primary hover:bg-orange-500 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          Log in to Enroll
        </button>
        <p className="text-xs text-center text-gray-500">
          You must be logged in to complete this purchase.
        </p>
      </div>
    );
  }
  return (
    <div className="w-full">
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {errorMessage}
        </div>
      )}

      <PayPalScriptProvider options={{ clientId, currency: "USD" }}>
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "pay",
          }}
          createOrder={async () => {
            setErrorMessage(null);

            try {
              const orderRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/orders`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ courseId }),
                },
              );

              const orderData = await orderRes.json();

              if (!orderRes.ok) {
                throw new Error(
                  orderData.error.message || "Failed to create local order.",
                );
              }

              const localOrderId = orderData.orderId;

              const paypalRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/paypal/create-order/${localOrderId}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                },
              );

              const paypalData = await paypalRes.json();

              if (!paypalRes.ok) {
                throw new Error(
                  paypalData.error.message ||
                    "Could not initialize PayPal transaction.",
                );
              }

              (window as any).__currentLocalOrderId = localOrderId;

              return paypalData.id;
            } catch (err: any) {
              console.error("Payment setup failed:", err);
              setErrorMessage(err.message || "Failed to initiate payment.");
              throw err;
            }
          }}
          onApprove={async (data) => {
            try {
              const localOrderId = (window as any).__currentLocalOrderId;

              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/paypal/capture-order`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    paypalOrderId: data.orderID,
                    orderId: Number(localOrderId),
                  }),
                },
              );

              const responseData = await res.json();

              if (!res.ok) {
                throw new Error(
                  responseData.message || "Failed to finalize payment.",
                );
              }

              router.push(`/student/courses?enrolled=true`);
            } catch (err: any) {
              setErrorMessage(
                err.message ||
                  "Payment capture failed. Please contact support.",
              );
            }
          }}
          onCancel={() => {
            setErrorMessage("Payment was canceled.");
          }}
          onError={(err) => {
            console.error("PayPal Error:", err);
            setErrorMessage("An unexpected PayPal error occurred.");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
