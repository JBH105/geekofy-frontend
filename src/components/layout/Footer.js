"use client";
import Link from "next/link";

export default function Footer() {
  // const pathname = usePathname();
  // const hideFooterRoutes = ["/business/review"];

  // if (hideFooterRoutes.find((path) => pathname?.includes(path))) {
  //   return null;
  // }

  return (
    <footer>
      {/* Navigation links on light blue background */}
      <div className="bg-[#D5E8FF80] py-4">
        <div className="layout_container">
          <nav className="flex flex-wrap text-sm justify-center gap-x-5 gap-y-3 md:gap-x-12 md:gap-y-12">
            <Link href="/" className="text-[#666666] hover:text-[#333333]">
              Home
            </Link>
            <Link href="/faq" className="text-[#666666] hover:text-[#333333]">
              FAQ's
            </Link>
            <Link href="/get-in-touch" className="text-[#666666] hover:text-[#333333]">
              Contact Us
            </Link>
            <Link href="/terms" className="text-[#666666] hover:text-[#333333]">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-[#666666] hover:text-[#333333]">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>

      {/* Copyright on dark blue background */}
      <div className="bg-[#181F31] py-4">
        <div className="container mx-auto">
          <div className="text-center text-sm text-white font-medium">
            Copyrights 2025. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
