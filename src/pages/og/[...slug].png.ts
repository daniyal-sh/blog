import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOgImage } from '../../lib/og';
import { getPosts, type Post } from '../../lib/posts';

export const getStaticPaths = (async () => {
  const posts = await getPosts();

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props, url }) => {
  const { post } = props as { post: Post };
  const png = await renderOgImage({
    title: post.data.title,
    description: post.data.description,
    date: post.data.date,
    url,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
