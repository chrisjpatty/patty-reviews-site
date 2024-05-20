import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface Article {
  id: number;
  attributes: {
    title: string;
    published: boolean;
    content: BlocksContent
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    tags: {
      name: string;
    }[];
    slug: string;
  };
}