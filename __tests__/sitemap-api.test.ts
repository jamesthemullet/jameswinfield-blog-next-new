import type { NextApiRequest, NextApiResponse } from 'next';
import sitemap from '../pages/api/sitemap';

jest.mock('../lib/api', () => ({
  getAllPostsWithSlug: jest.fn(),
}));

import { getAllPostsWithSlug } from '../lib/api';

function mockReqRes() {
  const req = {} as NextApiRequest;
  const res = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as NextApiResponse;
  return { req, res };
}

describe('pages/api/sitemap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('includes the static routes and one <url> entry per post slug', async () => {
    (getAllPostsWithSlug as jest.Mock).mockResolvedValue({
      edges: [{ node: { slug: 'hello-world' } }, { node: { slug: 'second-post' } }],
    });
    const { req, res } = mockReqRes();

    await sitemap(req, res);

    const xml = (res.send as jest.Mock).mock.calls[0][0] as string;
    expect(xml).toContain('<loc>https://www.jameswinfield.co.uk</loc>');
    expect(xml).toContain('<loc>https://www.jameswinfield.co.uk/blog</loc>');
    expect(xml).toContain('<loc>https://www.jameswinfield.co.uk/projects</loc>');
    expect(xml).toContain('<loc>https://www.jameswinfield.co.uk/timeline</loc>');
    expect(xml).toContain('<loc>https://www.jameswinfield.co.uk/posts/hello-world</loc>');
    expect(xml).toContain('<loc>https://www.jameswinfield.co.uk/posts/second-post</loc>');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/xml; charset=utf-8');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('still renders the static routes when there are no posts', async () => {
    (getAllPostsWithSlug as jest.Mock).mockResolvedValue({ edges: [] });
    const { req, res } = mockReqRes();

    await sitemap(req, res);

    const xml = (res.send as jest.Mock).mock.calls[0][0] as string;
    expect(xml).toContain('<loc>https://www.jameswinfield.co.uk</loc>');
    expect(xml).not.toContain('/posts/');
  });
});
