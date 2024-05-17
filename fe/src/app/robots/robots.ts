import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/', '/main', '/search', '/main', '/robots.txt', '/sitemap.xml'],
        disallow: ['/private/'],
      },
      {
        userAgent: 'Yeti',
        allow: ['/', '/main', '/search', '/main', '/robots.txt', '/sitemap.xml'],
        disallow: ['/private/'],
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        allow: ['/', '/main', '/search', '/main', '/robots.txt', '/sitemap.xml'],
        disallow: ['/private/'],
      },
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
    sitemap: 'https://commitanalyze.com/sitemap.xml',  // 사이트맵 URL을 수정
  }
}