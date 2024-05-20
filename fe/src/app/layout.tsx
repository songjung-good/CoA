import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import { cookies } from "next/headers";
import LoadingFloating from "@/components/header/LoadingFloating";

export const metadata: Metadata = {
  title: "COA",
  description: "커밋 기반 기여도 분석 사이트",
  icons: {
    icon: "/image/logo48.webp",
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
    "Commit Analyze는 프로젝트 내 개인의 커밋 기록을 분석하여 개인의 작업 패턴과 성과를 평가할 수 있는 유용한 지표들을 제공하는 도구입니다. 이를 통해 개인의 개발 역량을 객관적으로 파악하고, 향후 성장을 위한 인사이트를 얻을 수 있습니다.";
  const image = "https://commitanalyze.com/image/textLogo48.webp";
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
        <link rel="canonical" href="https://commitanalyze.com/main" />
        <link rel="icon" href="/image/logo.webp" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="Commit Analyze" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:domain" content="commitanalyze.com" />
      </head>
      <body className="h-auto min-h-screen pb-20 relative">
        <Header />
        {children}
        <LoadingFloating hasJWT={hasJWT} />
        <footer className="absolute bottom-0 w-full text-center">
          &copy; SSAFY 10th E101
        </footer>
      </body>
    </html>
  );
}
