import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const rolewiseRouteMap = {
  seller: ["/seller-onboarding"],
  admin: ["/admin"],
};

const publicRoutes = [
  "/",
  "/business/review",
  "/search-results",
  "/chat-seller",
  "/chat-buyer",
  "/buyer-profile",
  "/faq",
  "/get-in-touch",
  "/list-your-business",
  "/buyer-profile",
];

const publicStartWithRoutes = [
  "/seller-profile"
];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  return NextResponse.next();

  // Allow public routes
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    publicStartWithRoutes.find((path) => pathname.startsWith(path));

  if(isPublicRoute){
    return NextResponse.next();
  }

  // If no token, redirect to home page unless on root
  if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
  }

  // let isPathIncluded = false;

  // token?.role?.forEach?.(role => {
  //    if(rolewiseRouteMap[role]?.find(path => pathname.startsWith(path))){
  //     isPathIncluded = true;
  //    }
  // })

  const role = token?.role?.includes("admin") ? "admin" : "seller";

  if (!rolewiseRouteMap[role]?.find((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
