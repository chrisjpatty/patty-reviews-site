import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config.ts';
import { getExcerpt, sortItemsByDateDesc } from '../utils/data-utils.ts';
import type { Article } from '../types/types.ts'
import fetchApi from '../lib/strapi';

export async function GET(context: any) {
    const posts: Article[] = (
        await fetchApi<Article[]>({
            endpoint: 'blog-posts', // the content type to fetch
            wrappedByKey: 'data' // the key to unwrap the response
        })
    ).sort(sortItemsByDateDesc);

    return rss({
        title: siteConfig.title,
        description: siteConfig.description,
        site: context.site,
        items: posts.map((item) => {
            const excerpt = getExcerpt(item.attributes.content, 100)

            return {
                title: item.attributes.title,
                description: excerpt.excerpt,
                link: `/reviews/${item.attributes.slug}`,
                pubDate: new Date(item.attributes.publishedAt),
            }
        })
    });
}
