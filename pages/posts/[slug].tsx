import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useState } from 'react';
import Container from '../../components/container';
import PostBody from '../../components/post-body';
import MoreStories from '../../components/more-stories';
import Header from '../../components/header';
import PostHeader from '../../components/post-header';
import SectionSeparator from '../../components/section-separator';
import Layout from '../../components/layout';
import PostTitle from '../../components/post-title';
import Tags from '../../components/tags';
import { getAllPostsWithSlug, getPostAndMorePosts, getSocials } from '../../lib/api';
import { CMS_NAME } from '../../lib/constants';
import Nav from '../../components/nav';
import Comments from '../../components/comments';
import CommentForm from '../../components/commentForm';
import type { seoProps } from '../../lib/types';

type PostProps = {
  post: {
    slug: string;
    title: string;
    databaseId: number;
    featuredImage: {
      node: {
        sourceUrl: string;
        featuredImage: string;
        mediaDetails: { width: number; height: number };
      };
      sourceUrl: string;
    };
    date: string;
    author: {
      node: {
        firstName: string;
        lastName: string;
        name: string;
        avatar: {
          url: string;
        };
      };
    };
    categories: { edges: { length: number; node: { name: string } } };
    content: string;
    tags: {
      edges: {
        node: {
          name: string;
        };
      }[];
    };
    comments?: {
      edges: {
        node: {
          author: {
            node: {
              name: string;
              avatar: {
                url: string;
              };
            };
          };
          id: number;
          content: string;
          date: string;
        };
      }[];
    };
    seo: seoProps;
  };
  posts: {
    edges: { edges: string };
  };
  preview?: string;
  children: string;
  socials: {
    content: string;
  };
};

export default function Post({ post, posts, preview, socials }: PostProps) {
  const [commentData, setCommentData] = useState(post?.comments?.edges);
  const [newCommentPosted, setNewCommentPosted] = useState(false);
  const router = useRouter();
  const morePosts = posts?.edges;
  const handleCommentDataChange = (newData) => {
    const newComment = {
      node: {
        author: newData.author,
        id: newData.id,
        content: newData.content,
        date: newData.date,
      },
    };
    const data = [newComment, ...commentData];
    setCommentData(data);
    setNewCommentPosted(true);
  };

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={preview} socials={socials} seo={post?.seo} title={post.title}>
      <Nav />
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <PostHeader
                title={post.title}
                coverImage={post.featuredImage}
                date={post.date}
                author={post.author}
                categories={post.categories}
              />
              <PostBody content={post.content} />
              <footer>{post.tags.edges.length > 0 && <Tags tags={post.tags} />}</footer>
              <Comments comments={commentData} />
              <CommentForm
                postId={post.databaseId}
                setCommentData={handleCommentDataChange}
                newCommentPosted={newCommentPosted}
              />
            </article>

            <SectionSeparator />
            {Array.isArray(morePosts) && <MoreStories posts={morePosts} />}
          </>
        )}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params, preview = false, previewData }) => {
  const data = await getPostAndMorePosts(params?.slug, preview, previewData);
  const socials = await getSocials();

  return {
    props: {
      preview,
      post: data.post,
      posts: data.posts,
      socials,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug();

  return {
    paths: allPosts.edges.map(({ node }) => `/posts/${node.slug}`) || [],
    fallback: true,
  };
};
