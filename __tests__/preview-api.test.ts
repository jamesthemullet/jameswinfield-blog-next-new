import type { NextApiRequest, NextApiResponse } from 'next';
import exitPreview from '../pages/api/exit-preview';
import preview from '../pages/api/preview';

jest.mock('../lib/api', () => ({
  getPreviewPost: jest.fn(),
}));

import { getPreviewPost } from '../lib/api';

function mockReqRes(query: Record<string, string> = {}) {
  const req = { query } as unknown as NextApiRequest;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setPreviewData: jest.fn(),
    clearPreviewData: jest.fn(),
    writeHead: jest.fn(),
    end: jest.fn(),
  } as unknown as NextApiResponse;
  return { req, res };
}

describe('pages/api/preview', () => {
  const originalSecret = process.env.WORDPRESS_PREVIEW_SECRET;

  beforeEach(() => {
    process.env.WORDPRESS_PREVIEW_SECRET = 'shh-secret';
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.WORDPRESS_PREVIEW_SECRET = originalSecret;
  });

  it('returns 401 when the secret does not match', async () => {
    const { req, res } = mockReqRes({ secret: 'wrong', id: '1' });

    await preview(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(getPreviewPost).not.toHaveBeenCalled();
  });

  it('returns 401 when neither id nor slug is provided', async () => {
    const { req, res } = mockReqRes({ secret: 'shh-secret' });

    await preview(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(getPreviewPost).not.toHaveBeenCalled();
  });

  it('returns 401 when the WORDPRESS_PREVIEW_SECRET env var is unset', async () => {
    process.env.WORDPRESS_PREVIEW_SECRET = '';
    const { req, res } = mockReqRes({ secret: '', id: '1' });

    await preview(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('returns 401 when the post is not found', async () => {
    (getPreviewPost as jest.Mock).mockResolvedValue(null);
    const { req, res } = mockReqRes({ secret: 'shh-secret', id: '1' });

    await preview(req, res);

    expect(getPreviewPost).toHaveBeenCalledWith('1', 'DATABASE_ID');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
    expect(res.setPreviewData).not.toHaveBeenCalled();
  });

  it('looks up by SLUG when only slug is provided', async () => {
    (getPreviewPost as jest.Mock).mockResolvedValue({
      databaseId: 1,
      slug: 'hello-world',
      status: 'draft',
    });
    const { req, res } = mockReqRes({ secret: 'shh-secret', slug: 'hello-world' });

    await preview(req, res);

    expect(getPreviewPost).toHaveBeenCalledWith('hello-world', 'SLUG');
  });

  it('sets preview data and redirects to the post slug when the post exists', async () => {
    (getPreviewPost as jest.Mock).mockResolvedValue({
      databaseId: 42,
      slug: 'hello-world',
      status: 'draft',
    });
    const { req, res } = mockReqRes({ secret: 'shh-secret', id: '42' });

    await preview(req, res);

    expect(res.setPreviewData).toHaveBeenCalledWith({
      post: { id: 42, slug: 'hello-world', status: 'draft' },
    });
    expect(res.writeHead).toHaveBeenCalledWith(307, { Location: '/posts/hello-world' });
    expect(res.end).toHaveBeenCalled();
  });

  it('redirects using the databaseId when the post has no slug', async () => {
    (getPreviewPost as jest.Mock).mockResolvedValue({
      databaseId: 42,
      slug: '',
      status: 'draft',
    });
    const { req, res } = mockReqRes({ secret: 'shh-secret', id: '42' });

    await preview(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(307, { Location: '/posts/42' });
  });
});

describe('pages/api/exit-preview', () => {
  it('clears preview data and redirects to the homepage', async () => {
    const { req, res } = mockReqRes();

    await exitPreview(req, res);

    expect(res.clearPreviewData).toHaveBeenCalled();
    expect(res.writeHead).toHaveBeenCalledWith(307, { Location: '/' });
    expect(res.end).toHaveBeenCalled();
  });
});
