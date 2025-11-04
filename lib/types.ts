import { Key } from 'react';

export type AuthorProps = {
  node: {
    firstName: string;
    lastName: string;
    name: string;
    avatar: {
      url: string;
    };
  };
};

type CoverImageProps = {
  node: {
    sourceUrl: string;
    featuredImage: string;
    mediaDetails: {
      width: number;
      height: number;
    };
  };
};

type featuredImageProps = {
  node: {
    sourceUrl: string;
    featuredImage: string;
    mediaDetails: {
      width: number;
      height: number;
    };
  };
};

type NodeProps = {
  title: string;
  slug: string;
  featuredImage: featuredImageProps;
  date: string;
  excerpt: string;
  author: AuthorProps;
  content: string;
  id: Key;
};

export type PostTitle = {
  children: string;
};

export type TagsProps = {
  tags: {
    edges: {
      node: {
        name: string;
      };
    }[];
  };
};

export type AllPostsProps = {
  allPosts: {
    edges: {
      edges?: string[];
      node: NodeProps;
    }[];
  };
  preview: string;
  socials: {
    content: string;
  };
  edges: {
    node: NodeProps;
  }[];
};

export type PageProps = {
  page: {
    content: string;
    seo: seoProps;
  };
  socials: {
    content: string;
  };
  projects: {
    id: string;
    name: string;
    description: string;
    url: string;
    isPrivate: string;
    createdAt: string;
    updatedAt: string;
    homepageUrl: string;
  }[];
};

export type PostPreviewProps = {
  title: string;
  coverImage: CoverImageProps;
  date: string;
  excerpt: string;
  author: AuthorProps;
  slug: string;
};

export type PostHeaderProps = {
  title: string;
  coverImage: CoverImageProps;
  date: string;
  author: AuthorProps;
  categories: {
    edges: {
      length: number;
      node: {
        name: string;
      };
    };
  };
};

export type MoreStoriesProps = {
  posts: {
    edges?: string[];
    node: NodeProps;
  }[];
};

export type HeroPostProps = {
  title: string;
  coverImage: CoverImageProps;
  date: string;
  excerpt: string;
  author: AuthorProps;
  slug: string;
};

export type seoProps = {
  canonical: string;
  focuskw: string;
  metaDesc: string;
  metaKeywords: string;
  opengraphDescription: string;
  opengraphImage: {
    uri: string;
    altText: string;
    mediaItemUrl: string;
    mediaDetails: {
      width: string;
      height: string;
    };
  };
  opengraphTitle: string;
  opengraphUrl: string;
  opengraphSiteName: string;
  title: string;
};
