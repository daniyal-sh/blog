import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { getPosts } from '../lib/posts';
import { url } from '../utils/url';

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();
  const site = context.site ?? new URL('https://daniyal-sh.github.io');
  const feedSite = new URL(import.meta.env.BASE_URL, site);

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: feedSite,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: url(`/posts/${post.id}/`),
    })),
    customData: '<language>en-us</language>',
  });
};
