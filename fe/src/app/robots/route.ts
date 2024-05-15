import { NextResponse } from 'next/server';
import robots from '@/app/robots/robots';

export async function GET() {
  const robotsTxt = robots();
  let content = '';

  if (Array.isArray(robotsTxt.rules)) {
    robotsTxt.rules.forEach(rule => {
      if (Array.isArray(rule.userAgent)) {
        rule.userAgent.forEach(agent => {
          content += `User-agent: ${agent}\n`;
          if (rule.allow) {
            if (Array.isArray(rule.allow)) {
              rule.allow.forEach(path => {
                content += `Allow: ${path}\n`;
              });
            } else {
              content += `Allow: ${rule.allow}\n`;
            }
          }
          if (rule.disallow) {
            if (Array.isArray(rule.disallow)) {
              rule.disallow.forEach(path => {
                content += `Disallow: ${path}\n`;
              });
            } else {
              content += `Disallow: ${rule.disallow}\n`;
            }
          }
          content += '\n';
        });
      } else {
        content += `User-agent: ${rule.userAgent}\n`;
        if (rule.allow) {
          if (Array.isArray(rule.allow)) {
            rule.allow.forEach(path => {
              content += `Allow: ${path}\n`;
            });
          } else {
            content += `Allow: ${rule.allow}\n`;
          }
        }
        if (rule.disallow) {
          if (Array.isArray(rule.disallow)) {
            rule.disallow.forEach(path => {
              content += `Disallow: ${path}\n`;
            });
          } else {
            content += `Disallow: ${rule.disallow}\n`;
          }
        }
        content += '\n';
      }
    });
  }

  if (robotsTxt.sitemap) {
    if (Array.isArray(robotsTxt.sitemap)) {
      robotsTxt.sitemap.forEach(sitemap => {
        content += `Sitemap: ${sitemap}\n`;
      });
    } else {
      content += `Sitemap: ${robotsTxt.sitemap}\n`;
    }
  }

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
