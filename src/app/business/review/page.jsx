"use client";

import { Suspense } from "react";
import RateBusinessStep from "@/components/seller-onboarding/reviews/RateBusinessStep";
import { useSearchParams } from "next/navigation";

function RateBusinessStepWithSearchParams() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const sellerId = searchParams.get("sellerId");
  return <RateBusinessStep token={token} sellerId={sellerId} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RateBusinessStepWithSearchParams />
    </Suspense>
  );
}
