import type { APIRoute } from 'astro';
import { SITE } from '../../config';
import { renderOgImage } from '../../lib/og';

export const GET: APIRoute = async ({ url }) => {
  const png = await renderOgImage({
    title: SITE.description,
    description:
      'A quiet place for things I’m thinking about, building, and learning.',
    url,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
