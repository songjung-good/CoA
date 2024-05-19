import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/main', '/search', '/robots.txt', '/sitemap.xml'],
        disallow: ['/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/main', '/search', '/robots.txt', '/sitemap.xml'],
        disallow: ['/private/'],
      },
      {
        userAgent: 'Yeti',
        allow: ['/', '/main', '/search', '/robots.txt', '/sitemap.xml'],
        disallow: ['/private/'],
      },
      {
        userAgent: 'Applebot',
        allow: ['/', '/main', '/search', '/robots.txt', '/sitemap.xml'],
        disallow: ['/private/'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/main', '/search', '/robots.txt', '/sitemap.xml'],
        disallow: ['/private/'],
      },
    ],
    sitemap: 'https://commitanalyze.com/sitemap.xml',  // 사이트맵 URL을 수정
  }
}
