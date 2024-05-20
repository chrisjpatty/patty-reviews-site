import { type CollectionEntry } from 'astro:content';
import { slugify } from './common-utils';
import type { Article } from '../types/types';

export function sortItemsByDateDesc(itemA: Article, itemB: Article) {
    return new Date(itemB.attributes.publishedAt).getTime() - new Date(itemA.attributes.publishedAt).getTime();
}

export function getAllTags(posts: Article[]) {
    const tags: string[] = [...new Set(posts.flatMap((post) => post.attributes.tags || []).map(x => x.name).filter(Boolean))];
    return tags
        .map((tag) => {
            return {
                name: tag,
                slug: slugify(tag)
            };
        })
        .filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj.slug).indexOf(obj.slug) === pos;
        });
}

export function getPostsByTag(posts: Article[], tagSlug: string) {
    const filteredPosts: Article[] = posts.filter((post) => (post.attributes.tags || []).map((tag) => slugify(tag.name)).includes(tagSlug));
    return filteredPosts;
}

export function getExcerpt(content: Article['attributes']['content'], length: number) {
    const firstTextSection = content.find(section => section.type === 'paragraph')
    const text = firstTextSection ? getPlainText(firstTextSection.children) : '';
    const excerpt = text.slice(0, length);
    return {
        excerpt,
        hasMore: text.length > length
    };
}

export function getPlainText(block: any[]) {
    const text: string = block.reduce((acc, node) => {
        if (node.type === 'text') {
            return acc + node.text;
        }
        return acc + getPlainText(node.children);
    }, '');

    return text;
}