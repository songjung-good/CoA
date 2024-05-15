import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/private/'],
      },
      {
        userAgent: 'Yeti',
        allow: '/',
        disallow: ['/private/'],
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        disallow: ['/'],
      },
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
    sitemap: 'https://commitanalyze.com/sitemap.xml',  // 사이트맵 URL을 수정
  }
}