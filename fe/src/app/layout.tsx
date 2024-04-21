import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COA",
  description:
    "커밋 기반 기여도 분석 사이트",
  icons: {
    icon: "/image/logo48.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
