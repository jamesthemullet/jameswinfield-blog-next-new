import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// isomorphic-dompurify eagerly constructs a jsdom window for its Node.js
// fallback path, which pulls in an ESM-only transitive dependency Jest
// can't load. In this test environment (`jest-environment-jsdom`) a real
// `window` already exists, so mock in the real `dompurify` package bound
// to it directly — same sanitization logic, without the broken fallback.
jest.mock('isomorphic-dompurify', () => ({
  __esModule: true,
  default: require('dompurify'),
}));

import Index from '../pages/blog';

jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/blog' }),
}));

describe('Blog page heading', () => {
  it('renders a single h1 with the page title', () => {
    render(<Index allPosts={{ edges: [] }} preview={false} socials={{ content: '' }} edges={[]} />);

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Blog');
  });
});
