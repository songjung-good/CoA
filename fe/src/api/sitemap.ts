import { NextApiRequest, NextApiResponse } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
// 예시 데이터베이스 호출 함수 (실제로는 데이터베이스나 API에서 데이터를 가져와야 함)
const fetchDynamicRoutes = async () => {

  return [
    { url: '/', changefreq: 'daily', priority: 0.5, lastmod: new Date().toISOString() },
    { url: '/main', changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() },
    { url: '/search', changefreq: 'daily', priority: 0.8, lastmod: new Date().toISOString() },
  ];
};

const Sitemap = async (req: NextApiRequest, res: NextApiResponse) => {
  const dynamicRoutes = await fetchDynamicRoutes();

  const stream = new SitemapStream({ hostname: 'https://commitanalyze.com' });

  res.writeHead(200, {
    'Content-Type': 'application/xml',
  });

  const xmlString = await streamToPromise(Readable.from(dynamicRoutes).pipe(stream)).then(data =>
    data.toString()
  );

  res.end(xmlString);
};

export default Sitemap;
