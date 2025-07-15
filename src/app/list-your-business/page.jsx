"use client";
import LandingPage from "@/components/layout/landing/LandingPage";
import "./../fonts.css";
import localFont from "next/font/local";

const Helvetica = localFont({
  src: [
    {
      path: "../../../public/fonts/helvetica/Helvetica.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/helvetica/Helvetica-Oblique.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../../public/fonts/helvetica/Helvetica-Bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../../../public/fonts/helvetica/Helvetica-BoldOblique.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  display: "swap",
});

export default function Home() {
  return (
    <div className={Helvetica.className}>
      <LandingPage />
      <div className="py-16"></div>
    </div>
  );
}
