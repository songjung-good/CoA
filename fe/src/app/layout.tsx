import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import { cookies } from "next/headers";
import LoadingFloating from "@/components/header/LoadingFloating";

export const metadata: Metadata = {
  title: "COA",
  description: "커밋 기반 기여도 분석 사이트",
  icons: {
    icon: "/image/logo48.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  // cookie 존재 여부를 boolean으로 return
  const hasJWT = cookieStore.has("JWT");
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <LoadingFloating hasJWT={hasJWT} />
      </body>
    </html>
  );
}
