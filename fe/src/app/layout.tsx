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

  const title = "CoA - 커밋 기반 프로젝트 기여도 분석 사이트";
  const description =
    "Commit Analyze는 프로젝트 레포지토리의 커밋을 분석하여 유용한 지표를 제공합니다.";
  const image = "https://commitanalyze.com/image/textLogo48.png";
  const url = "https://commitanalyze.com";

  return (
    <html lang="ko">
      <head>
        <meta
          name="naver-site-verification"
          content="91a89f26cf678c7d7c627c42df934e3a18ff9a6d"
        />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/image/logo48.png" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:domain" content="commitanalyze.com" />
      </head>
      <body>
        <Header />
        {children}
        <LoadingFloating hasJWT={hasJWT} />
        <footer className="my-10 w-full text-center">SSAFY 10th E101</footer>
      </body>
    </html>
  );
}
