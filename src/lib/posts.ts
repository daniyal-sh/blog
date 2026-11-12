import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function getAdjacentPosts(posts: Post[], id: string) {
  const index = posts.findIndex((post) => post.id === id);

  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}
