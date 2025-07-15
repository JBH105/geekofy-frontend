"use client";

import "./globals.css";
import "./fonts.css";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import localFont from "next/font/local";

const Helvetica = localFont({
  src: [
    {
      path: "../../public/fonts/helvetica/Helvetica.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/helvetica/Helvetica-Oblique.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/helvetica/Helvetica-Bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../../public/fonts/helvetica/Helvetica-BoldOblique.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  display: "swap",
});

export default function RootLayout({ children, session }) {
  return (
    <html lang="en" className={Helvetica.className}>
      <body className="bg-[#fcfcfc] min-h-screen flex flex-col overflow-x-hidden">
        <SessionProvider
          session={session}
          basePath="/api/auth"
          refetchInterval={5 * 60}
          refetchOnWindowFocus={true}
        >
          {/* Layout wrapper */}
          <div className="flex flex-col min-h-screen">
            {/* Main content */}
            <main className="flex-grow">{children}</main>

            {/* Sticky footer */}
            <Footer />
          </div>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </SessionProvider>
      </body>
    </html>
  );
}
