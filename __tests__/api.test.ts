import { createComment, getPreviewPost } from '../lib/api';

function mockFetchOnce(response: Partial<Response> & { json: () => Promise<unknown> }) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({ 'content-type': 'application/json' }),
    ...response,
  });
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

describe('getPreviewPost', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('defaults to DATABASE_ID when no idType is given', async () => {
    const fetchMock = mockFetchOnce({
      json: async () => ({
        data: { post: { databaseId: 1, slug: 'hello-world', status: 'draft' } },
      }),
    });

    const post = await getPreviewPost(1);

    expect(post).toEqual({ databaseId: 1, slug: 'hello-world', status: 'draft' });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.variables).toEqual({ id: 1, idType: 'DATABASE_ID' });
  });

  it('passes SLUG through as idType when provided', async () => {
    const fetchMock = mockFetchOnce({
      json: async () => ({
        data: { post: { databaseId: 2, slug: 'hello-world', status: 'publish' } },
      }),
    });

    const post = await getPreviewPost('hello-world', 'SLUG');

    expect(post).toEqual({ databaseId: 2, slug: 'hello-world', status: 'publish' });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.variables).toEqual({ id: 'hello-world', idType: 'SLUG' });
  });

  it('throws when the GraphQL response contains errors', async () => {
    mockFetchOnce({
      json: async () => ({ errors: [{ message: 'not found' }] }),
    });

    await expect(getPreviewPost(999)).rejects.toThrow('Failed to fetch API');
  });

  it('throws when the response is not ok', async () => {
    mockFetchOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    });

    await expect(getPreviewPost(1)).rejects.toThrow(
      'WordPress API responded with 500 Internal Server Error',
    );
  });
});

describe('createComment', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the created comment on success', async () => {
    const comment = {
      author: { node: { email: 'alice@example.com', id: '1', name: 'Alice', url: '' } },
      content: 'Great post!',
      commentId: 10,
      databaseId: 10,
      date: '2026-09-01',
      id: 'Y29tbWVudDoxMA==',
    };
    const fetchMock = mockFetchOnce({
      json: async () => ({
        data: { createComment: { clientMutationId: null, comment, success: true } },
      }),
    });

    const result = await createComment(1, 'Alice', 'alice@example.com', '', 'Great post!');

    expect(result).toEqual(comment);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.variables).toEqual({
      input: {
        author: 'Alice',
        authorEmail: 'alice@example.com',
        authorUrl: '',
        content: 'Great post!',
        commentOn: 1,
      },
    });
  });

  it('throws when the GraphQL response contains errors', async () => {
    mockFetchOnce({
      json: async () => ({ errors: [{ message: 'validation failed' }] }),
    });

    await expect(createComment(1, 'Alice', 'alice@example.com', '', 'Great post!')).rejects.toThrow(
      'Failed to create comment',
    );
  });
});
