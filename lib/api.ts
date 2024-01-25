const API_URL = process.env.WORDPRESS_API_URL;
const GITHUB_API_URL = 'https://api.github.com/graphql';
const GITHUB_API_SECRET = process.env.GITHUB_API_SECRET;

async function fetchAPI(query = '', { variables }: Record<string, any> = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  console.log(10, API_URL);

  // WPGraphQL Plugin must be enabled
  const res = await fetch(API_URL, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function getPreviewPost(id, idType = 'DATABASE_ID') {
  const data = await fetchAPI(
    `
    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`,
    {
      variables: { id, idType },
    }
  );
  return data.post;
}

export async function getPage(id, idType = 'DATABASE_ID') {
  const data = await fetchAPI(
    `
    query Page($id: ID!, $idType: PageIdType!) {
      page(id: $id, idType: $idType) {
        slug
        content
        title
        seo {
          metaDesc
          focuskw
          title
          canonical
          metaKeywords
          opengraphTitle
          opengraphDescription
          opengraphUrl
          opengraphSiteName
          opengraphImage {
            uri
            altText
            mediaDetails {
              file
              height
              width
            }
            mediaItemUrl
            sourceUrl
            srcSet
          }
        }
      }
    }`,
    {
      variables: { id, idType },
    }
  );
  return data.page;
}

export async function getPagesForHomePage() {
  const data = await fetchAPI(
    `
    query PagesForHomePage {
      pages(where: { in: [737, 739, 751, 741, 761] }) {
        edges {
          node {
            featuredImageId
            featuredImageDatabaseId
            featuredImage {
              node {
                id
                mediaDetails {
                  height
                  width
                }
              }
            }
            slug
            title
            content
            id
          }
        }
      }
    }`
  );
  return data.pages;
}

export async function getSocials() {
  const data = await fetchAPI(
    `
    query Socials {
      page(id: 743, idType: DATABASE_ID) {
        slug
        content
        title
      }
    }`
  );
  return data.page;
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      posts(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.posts;
}

export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
                mediaDetails {
                  height
                  width
                }
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  );

  return data?.posts;
}

export async function getPostAndMorePosts(slug, preview, previewData) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId ? Number(slug) === postPreview.id : slug === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === 'draft';
  const isRevision = isSamePost && postPreview?.status === 'publish';
  const data = await fetchAPI(
    `
    fragment AuthorFields on User {
      name
      firstName
      lastName
      avatar {
        url
      }
    }
    fragment PostFields on Post {
      title
      excerpt
      slug
      date
      databaseId
      featuredImage {
        node {
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
      comments {
        edges {
          node {
            id
            date
            content
            author {
              node {
                id
                name
              }
            }
          }
        }
      }
      author {
        node {
          ...AuthorFields
        }
      }
      categories {
        edges {
          node {
            name
          }
        }
      }
      tags {
        edges {
          node {
            name
          }
        }
      }
      seo {
        metaDesc
        focuskw
        title
        canonical
        metaKeywords
        opengraphTitle
        opengraphDescription
        opengraphUrl
        opengraphSiteName
        opengraphImage {
          uri
          altText
          mediaDetails {
            file
            height
            width
          }
          mediaItemUrl
          sourceUrl
          srcSet
        }
        
      }
    }
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
        seo {
          metaDesc
          focuskw
          title
          canonical
          metaKeywords
          opengraphTitle
          opengraphDescription
          opengraphUrl
          opengraphSiteName
          opengraphImage {
            uri
            altText
            mediaDetails {
              file
              height
              width
            }
            mediaItemUrl
            sourceUrl
            srcSet
          }
        }
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
              author {
                node {
                  ...AuthorFields
                }
              }
            }
          }
        }
        `
            : ''
        }
      }
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? postPreview.id : slug,
        idType: isDraft ? 'DATABASE_ID' : 'SLUG',
      },
    }
  );

  // Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }

  // Filter out the main post
  data.posts.edges = data.posts.edges.filter(({ node }) => node.slug !== slug);
  // If there are still 3 posts, remove the last one
  if (data.posts.edges.length > 2) data.posts.edges.pop();

  return data;
}

export async function createComment(postId, name, email, authorUrl, content) {
  const query = `
    mutation CreateComment($input: CreateCommentInput!) {
      createComment(input: $input) {
        clientMutationId
        comment {
          author {
            node {
              email
              id
              name
              url
            }
          }
          content
          commentId
          databaseId
          date
          id
        }
        success
      }
    }
  `;
  const variables = {
    input: {
      author: name,
      authorEmail: email,
      authorUrl,
      content: content.toString(),
      commentOn: parseInt(postId),
    },
  };
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const res = await fetch('https://blog.jameswinfield.co.uk/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to create comment');
  }

  return json.data.createComment.comment;
}

async function fetchGithubAPI(query = '') {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${GITHUB_API_SECRET}`,
  };

  const res = await fetch(GITHUB_API_URL, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      query,
    }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function getGithubProjects() {
  const data = await fetchGithubAPI(`
    query MyProjects {
      viewer {
        repositories(first: 10) {
          edges {
            node {
              id
              name
              description
              url
              isPrivate
              createdAt
              updatedAt
              homepageUrl
            }
          }
        }
      }
    }
  `);

  return data.viewer.repositories.edges.map((edge) => edge.node);
}
